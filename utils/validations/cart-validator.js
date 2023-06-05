import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";

export const createCartValidation = [
  check("productId")
    .notEmpty()
    .withMessage("product is required!")
    .isMongoId()
    .withMessage("invalide id formate"),
  check("color").notEmpty().withMessage("please select product color"),
  check("quandtity").optional(),
  validatorMiddleware,
];

export const deleteCartValidation = [
  param("id")
    .notEmpty()
    .withMessage("item id is required!")
    .isMongoId()
    .withMessage("invalide id formate"),
  validatorMiddleware,
];
export const updateCartValidation = [
  param("id")
    .notEmpty()
    .withMessage("item id is required!")
    .isMongoId()
    .withMessage("invalide id formate"),
  check("quantity").notEmpty().withMessage("quantity is required!"),
  validatorMiddleware,
];

export const applyCouponValidation = [
  check("coupon").notEmpty().withMessage("coupon is required!"),
  validatorMiddleware,
];
