import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategiories,
  getCategory,
  updateCategory,
  uploadImage,
  resizeImage,
} from "../controllers/category.controller.js";
import {
  createCategoryValidation,
  deleteCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation,
} from "../utils/validations/category-validator.js";
import subcategoryRoute from "./subcategory.route.js";

import { auth, permissions } from "../middleware/protection.middleware.js";

const router = express.Router();
//nested route
router.use("/:categoryId/subcategories", subcategoryRoute);

router
  .route("/")
  .post(
    auth,
    permissions("admin", "manager"),
    uploadImage,
    resizeImage,
    createCategoryValidation,
    createCategory
  )
  .get(getCategiories);
router
  .route("/:id")
  .get(getCategoryValidation, getCategory)
  .patch(
    auth,
    permissions("admin", "manager"),
    uploadImage,
    resizeImage,
    updateCategoryValidation,
    updateCategory
  )
  .delete(auth, permissions("admin"), deleteCategoryValidation, deleteCategory);
export default router;
