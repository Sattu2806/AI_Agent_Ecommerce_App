import express from 'express'
import cors from "cors";
import {prisma} from "./config/db.js"
import { Request, Response } from 'express';
import authRoutes from "./routes/authRoutes.js";
import sellerRoutes from "./routes/sellerRoute.js"

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.send('Hello, World! This is a simple Express server using import syntax.');
});

app.get("/health", async (_req: Request, res: Response) => {
  let db = "disconnected";
  try {
    await prisma.$connect();
    db = "connected";
  } catch {
    // ignore
  } finally {
    await prisma.$disconnect();
  }
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: db,
  });
});

app.use("/api/auth",authRoutes)
app.use("/api/seller",sellerRoutes)
export default app