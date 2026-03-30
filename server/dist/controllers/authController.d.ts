import { Request, Response } from "express";
export declare function register(req: Request, res: Response): Promise<void>;
export declare function login(req: Request, res: Response): Promise<void>;
export declare function me(req: Request, res: Response): Promise<void>;
export declare function updateMe(req: Request, res: Response): Promise<void>;
export declare function updatePassword(req: Request, res: Response): Promise<void>;
export declare function googleRedirect(req: Request, res: Response): void;
export declare function googleCallback(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=authController.d.ts.map