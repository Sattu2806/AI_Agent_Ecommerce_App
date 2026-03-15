import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { env } from "../config/env.js";
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
export async function register(req, res) {
    try {
        const { email, password, name } = req.body;
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
        const token = jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, { expiresIn: TOKEN_EXPIRY });
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
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Registration failed" });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
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
        const token = jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, { expiresIn: TOKEN_EXPIRY });
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
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
}
//# sourceMappingURL=authController.js.map