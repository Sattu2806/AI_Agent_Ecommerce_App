import express from 'express';
import cors from "cors";
import { prisma } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('Hello, World! This is a simple Express server using import syntax.');
});
app.get("/health", async (_req, res) => {
    let db = "disconnected";
    try {
        await prisma.$connect();
        db = "connected";
    }
    catch {
        // ignore
    }
    finally {
        await prisma.$disconnect();
    }
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: db,
    });
});
app.use("/api/auth", authRoutes);
export default app;
//# sourceMappingURL=app.js.map