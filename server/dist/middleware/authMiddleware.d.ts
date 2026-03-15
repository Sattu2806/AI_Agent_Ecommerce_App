import { Request, Response, NextFunction } from "express";
export type JwtPayload = {
    userId: string;
    email: string;
};
export declare function authMiddleware(req: Request & {
    user?: JwtPayload;
}, res: Response, next: NextFunction): void;
/** Like authMiddleware but does not 401 when token is missing; sets req.user only when valid. */
export declare function optionalAuthMiddleware(req: Request & {
    user?: JwtPayload;
}, res: Response, next: NextFunction): void;
//# sourceMappingURL=authMiddleware.d.ts.map