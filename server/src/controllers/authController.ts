import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../config/db.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";


export async function register(req: Request, res: Response) {
    try{
        const { email, password, name } = req.body as {
            email?: string;
            password?: string;
            name?: string;
        };

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ error: "An account with this email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name?.trim() || null,
                provider: "local",
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            env.jwtSecret,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
            expiresIn: TOKEN_EXPIRY,
        });
    }
    catch{

    }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      expiresIn: TOKEN_EXPIRY,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
}

export async function me(req: Request, res: Response) {
  const payload = (req as Request & { user?: { userId: string } }).user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const found = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, image: true, provider: true },
  });
  if (!found) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({ user: { ...found, role: found.role.toLowerCase() } });
}

export async function updateMe(req: Request, res: Response) {
  const payload = (req as Request & { user?: { userId: string } }).user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { name } = req.body as { name?: string };
  const updates: { name?: string | null } = {};
  if (typeof name === "string") {
    updates.name = name.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    const found = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, image: true, provider: true },
    });
    if (!found) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user: { ...found, role: found.role.toLowerCase() } });
    return;
    }
  const updated = await prisma.user.update({
    where: { id: payload.userId },
    data: updates,
    select: { id: true, email: true, name: true, role: true, image: true, provider: true },
  });
  res.json({ user: { ...updated, role: updated.role.toLowerCase() } });
}

export async function updatePassword(req: Request, res: Response) {
  const payload = (req as Request & { user?: { userId: string } }).user;
  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current password and new password are required" });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { password: true, provider: true },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (user.provider !== "local" || !user.password) {
    res.status(400).json({ error: "Password cannot be changed for this account" });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: payload.userId },
    data: { password: hashedPassword },
  });
  res.json({ success: true });
}

export function googleRedirect(req: Request, res: Response) {
  if (!env.googleClientId || !env.googleClientSecret) {
    res.status(503).json({
      error: "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
    });
    return;
  }

  const state = jwt.sign(
    { nonce: crypto.randomBytes(16).toString("hex") },
    env.jwtSecret,
    { expiresIn: "10m" }
  );
  const redirectUri = `${env.serverUrl}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}

export async function googleCallback(req: Request, res: Response) {
  if (!env.googleClientId || !env.googleClientSecret) {
    res.redirect(`${env.clientUrl}/sign-in?error=oauth_not_configured`);
    return;
  }

  const { code, state, error } = req.query as {
    code?: string;
    state?: string;
    error?: string;
  };

  if (error) {
    res.redirect(`${env.clientUrl}/sign-in?error=${encodeURIComponent(error)}`);
    return;
  }
  if (!code || !state) {
    res.redirect(`${env.clientUrl}/sign-in?error=missing_code`);
    return;
  }

  try {
    jwt.verify(state, env.jwtSecret);
  } catch {
    res.redirect(`${env.clientUrl}/sign-in?error=invalid_state`);
    return;
  }

  const redirectUri = `${env.serverUrl}/api/auth/google/callback`;
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.googleClientId!,
      client_secret: env.googleClientSecret!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("Google token exchange failed:", err);
    res.redirect(`${env.clientUrl}/sign-in?error=token_exchange_failed`);
    return;
  }

  const tokens = (await tokenRes.json()) as { access_token: string };
  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userRes.ok) {
    res.redirect(`${env.clientUrl}/sign-in?error=userinfo_failed`);
    return;
  }

  const profile = (await userRes.json()) as {
    id: string;
    email: string;
    name?: string;
    picture?: string;
    verified_email?: boolean;
  };

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { provider: "google", providerId: profile.id },
        { email: profile.email },
      ],
    },
  });

  let user: { id: string; email: string };

  if (!existing) {
    user = await prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name ?? null,
        image: profile.picture ?? null,
        provider: "google",
        providerId: profile.id,
        isVerified: profile.verified_email ?? false,
      },
      select: { id: true, email: true },
    });
  } else {
    if (existing.provider !== "google") {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          provider: "google",
          providerId: profile.id,
          image: profile.picture ?? existing.image,
          name: existing.name ?? profile.name ?? null,
          isVerified: profile.verified_email ?? existing.isVerified,
        },
      });
    }
    user = { id: existing.id, email: existing.email };
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: TOKEN_EXPIRY }
  );

  res.redirect(`${env.clientUrl}/auth/callback?token=${encodeURIComponent(token)}`);
}