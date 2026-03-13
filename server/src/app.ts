import express from 'express'
import {prisma} from "./config/db.js"
import { Request, Response } from 'express';

const app = express()

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

export default app