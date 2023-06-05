import express from "express";
import { auth, permissions } from "../middleware/protection.middleware.js";
import {
  createCart,
  getCart,
  deleteItemFromCart,
  updateItemInCart,
  clearCart,
  applyCoupon,
} from "../controllers/cart.controller.js";
import {
  applyCouponValidation,
  createCartValidation,
  deleteCartValidation,
  updateCartValidation,
} from "../utils/validations/cart-validator.js";
const router = express.Router();

router.use(auth, permissions("user"));
router
  .route("/")
  .post(createCartValidation, createCart)
  .get(getCart)
  .delete(clearCart);
router.patch("/applycoupon", applyCouponValidation, applyCoupon);
router
  .route("/:itemId")
  .delete(deleteCartValidation, deleteItemFromCart)
  .patch(updateCartValidation, updateItemInCart);
export default router;
