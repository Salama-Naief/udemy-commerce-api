import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  uploadProductImages,
  resizeImages,
} from "../controllers/product.controller.js";
import {
  deleteProductValidation,
  getProductValidation,
  createProductValidator,
  updateProductValidation,
} from "../utils/validations/product-validator.js";
import { auth, permissions } from "../middleware/protection.middleware.js";
import reviewRoute from "./review.route.js";
const router = express.Router();

//nest route
router.use("/:productId/review", reviewRoute);

router
  .route("/")
  .post(
    auth,
    permissions("admin", "manager"),
    uploadProductImages,
    resizeImages,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .get(getProductValidation, getProduct)
  .patch(
    auth,
    permissions("admin", "manager"),
    uploadProductImages,
    resizeImages,
    updateProductValidation,
    updateProduct
  )
  .delete(auth, permissions("admin"), deleteProductValidation, deleteProduct);
export default router;
