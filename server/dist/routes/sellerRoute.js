import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as productController from "../controllers/productController.js";
import * as sellerController from "../controllers/sellerController.js";
const router = Router();
router.use(authMiddleware);
router.get("/me", sellerController.getMe);
router.patch("/me", sellerController.updateMe);
router.post("/setup", sellerController.setupStore);
router.get("/dashboard", sellerController.getDashboard);
router.get("/products/:productId", productController.getMyProduct);
router.post("/products", productController.createProduct);
router.patch("/products/:productId", productController.updateMyProduct);
export default router;
//# sourceMappingURL=sellerRoute.js.map