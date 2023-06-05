import express from "express";
import {
  creatSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategory,
  setParamsToBody,
  updateSubcategory,
  createFilterObj,
} from "../controllers/subCategory.controller.js";
import {
  createSubCategoryValidation,
  deleteSubCategoryValidation,
  getSubCategoryValidation,
  updateSubCategoryValidation,
} from "../utils/validations/subcategory-validator.js";
import { auth, permissions } from "../middleware/protection.middleware.js";
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth,
    permissions("admin", "manager"),
    setParamsToBody,
    createSubCategoryValidation,
    creatSubcategory
  )
  .get(createFilterObj, getSubcategories);
router
  .route("/:id")
  .get(getSubCategoryValidation, getSubcategory)
  .patch(
    auth,
    permissions("admin", "manager"),
    updateSubCategoryValidation,
    updateSubcategory
  )
  .delete(
    auth,
    permissions("admin"),
    deleteSubCategoryValidation,
    deleteSubcategory
  );
export default router;
