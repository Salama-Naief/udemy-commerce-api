import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import couponModel from "../../models/coupon.model.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import productModel from "../../models/product.model.js";

//@desc create Coupon validations
export const createCouponValidation = [
  check("name")
    .notEmpty()
    .withMessage("coupon title is required!")
    .custom(async (val, { req }) => {
      const name = val.trim().toUpperCase().replace(/ /g, "_");
      const coupon = await couponModel.findOne({ name });
      if (coupon) {
        throw new BadRequestError("coupon name is used!");
      }

      req.body.expireAt = Date.now();
      return true;
    }),
  check("discount").notEmpty().withMessage("coupon dicount is required!"),
  check("expireAt").notEmpty().withMessage("expire date is required!"),
  check("productId")
    .notEmpty()
    .withMessage("product for this coupon is required!")
    .isMongoId()
    .withMessage("wrong id formate")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new NotFoundError("product with this id is not found!");
      }
      const name = req.body.name.trim().toUpperCase().replace(/ /g, "_");

      req.body.name = name;
      return true;
    }),
  validatorMiddleware,
];

//@desc update Coupon validation
export const updateCouponValidation = [
  check("name")
    .optional()
    .custom(async (val) => {
      const name = val.trim().toUpperCase().replace(/ /g, "_");
      const coupon = await couponModel.findOne({ name });
      if (coupon) {
        throw new BadRequestError("coupon name is used!");
      }

      return true;
    }),
  param("id")
    .isMongoId()
    .withMessage("wrong id formate")
    .custom((val, { req }) => {
      const name = req.body.name.trim().toUpperCase().replace(/ /g, "_");
      req.body.name = name;
      return true;
    }),
  check("productId")
    .optional()
    .isMongoId()
    .withMessage("wrong id formate")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new NotFoundError("product with this id is not found!");
      }
      return true;
    }),
  validatorMiddleware,
];

//@desc delete Coupon validation
export const deleteCouponValidation = [
  param("id").isMongoId().withMessage("wrong id fomate"),
  validatorMiddleware,
];

//@desc get single Coupon validation
export const getCouponValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  validatorMiddleware,
];
