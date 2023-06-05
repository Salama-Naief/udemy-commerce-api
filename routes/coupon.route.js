import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import {
  createCouponValidation,
  deleteCouponValidation,
  getCouponValidation,
  updateCouponValidation,
} from "../utils/validations/coupon-validator.js";

import { auth, permissions } from "../middleware/protection.middleware.js";
const router = express.Router();

router.use(auth, permissions("admin", "manager"));
router.route("/").post(createCouponValidation, createCoupon).get(getCoupons);
router
  .route("/:id")
  .get(getCouponValidation, getCoupon)
  .patch(updateCouponValidation, updateCoupon)
  .delete(deleteCouponValidation, deleteCoupon);
export default router;
