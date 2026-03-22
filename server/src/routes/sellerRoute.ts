import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as sellerController from "../controllers/sellerController.js";

const router = Router();

router.use(authMiddleware);
router.get("/me", sellerController.getMe);
router.patch("/me", sellerController.updateMe);
router.post("/setup", sellerController.setupStore);
router.get("/dashboard", sellerController.getDashboard);
export default router;
