import { Router } from "express";
import * as authController from "../controllers/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/me", authMiddleware, authController.me);
router.patch("/me", authMiddleware, authController.updateMe);
router.patch("/me/password", authMiddleware, authController.updatePassword);
router.get("/google", authController.googleRedirect);
router.get("/google/callback", authController.googleCallback);

export default router;