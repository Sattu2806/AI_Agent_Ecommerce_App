import { Request, Response } from "express";
import type { JwtPayload } from "../middleware/authMiddleware.js";
type AuthRequest = Request & {
    user?: JwtPayload;
};
export declare function getMe(req: AuthRequest, res: Response): Promise<void>;
export declare function updateMe(req: AuthRequest, res: Response): Promise<void>;
export declare function setupStore(req: AuthRequest, res: Response): Promise<void>;
export declare function getDashboard(req: AuthRequest, res: Response): Promise<void>;
export {};
//# sourceMappingURL=sellerController.d.ts.map