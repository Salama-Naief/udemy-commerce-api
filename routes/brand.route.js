import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
  uploadImage,
  resizeImage,
} from "../controllers/brand.controller.js";
import {
  createBrandValidation,
  deleteBrandValidation,
  getBrandValidation,
  updateBrandValidation,
} from "../utils/validations/brand-validator.js";

import { auth, permissions } from "../middleware/protection.middleware.js";
const router = express.Router();

router
  .route("/")
  .post(
    auth,
    permissions("admin", "manager"),
    uploadImage,
    resizeImage,
    createBrandValidation,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidation, getBrand)
  .patch(
    auth,
    permissions("admin", "manager"),
    uploadImage,
    resizeImage,
    updateBrandValidation,
    updateBrand
  )
  .delete(auth, permissions("admin"), deleteBrandValidation, deleteBrand);
export default router;
