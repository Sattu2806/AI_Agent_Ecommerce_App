import { Request, Response } from "express";
import type { JwtPayload } from "../middleware/authMiddleware.js";
type AuthRequest = Request & {
    user?: JwtPayload;
};
export declare function createProduct(req: AuthRequest, res: Response): Promise<void>;
export declare function getMyProduct(req: AuthRequest, res: Response): Promise<void>;
export declare function updateMyProduct(req: AuthRequest, res: Response): Promise<void>;
export {};
//# sourceMappingURL=productController.d.ts.map