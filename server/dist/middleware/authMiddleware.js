import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;
    if (!token) {
        res.status(401).json({ error: "Missing or invalid token" });
        return;
    }
    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
/** Like authMiddleware but does not 401 when token is missing; sets req.user only when valid. */
export function optionalAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;
    if (!token) {
        next();
        return;
    }
    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;
    }
    catch {
        // invalid token – leave req.user unset
    }
    next();
}
//# sourceMappingURL=authMiddleware.js.map