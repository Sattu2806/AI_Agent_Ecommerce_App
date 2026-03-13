import { PrismaClient } from "@prisma/client/edge";
import { PrismaNeon } from "@prisma/adapter-neon";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is required");
}
const adapter = new PrismaNeon({ connectionString });
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ??
    (globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    }));
//# sourceMappingURL=prisma.js.map