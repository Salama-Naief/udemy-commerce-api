import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import {
  BadRequestError,
  NotFoundError,
  PermissionsError,
} from "../../errors/index.js";
import productModel from "../../models/product.model.js";
import reviewModel from "../../models/review.model.js";

//@desc create Review validations
export const createReviewValidation = [
  check("content").optional(),
  check("rate")
    .notEmpty()
    .withMessage("rate is required!")
    .isFloat()
    .custom((val) => {
      if (val < 1 || val > 5) {
        throw new BadRequestError("rate must be between 1 and 5");
      }
      return true;
    }),
  check("product")
    .notEmpty()
    .withMessage("product is required!")
    .isMongoId()
    .withMessage("unvalid product id formate!")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new NotFoundError(`product with id =${val} is not found!`);
      }
      const review = await reviewModel.findOne({
        user: req.user.userId,
        product: val,
      });
      if (review) {
        throw new BadRequestError("you can add only one review the product");
      }
      req.body.user = req.user.userId;
      return true;
    }),
  validatorMiddleware,
];

//@desc update Review validation
export const updateReviewValidation = [
  param("id")
    .isMongoId()
    .withMessage("wrong id formate")
    .custom(async (val, { req }) => {
      const review = await reviewModel.findById(val);
      if (!review) {
        throw new NotFoundError(`review with id =${val} is not found!`);
      }

      if (review.user._id.toString() !== req.user.userId.toString()) {
        throw new PermissionsError("you can update only your review");
      }
      return true;
    }),
  check("rate")
    .optional()
    .isFloat()
    .custom((val, { req }) => {
      if (val < 1 || val > 5) {
        throw new BadRequestError("rate must be between 1 and 5");
      }
      //user can only update content or rate of his review
      const body = { ...req.body };
      delete body.product;
      req.body = body;
      return true;
    }),

  validatorMiddleware,
];

//@desc delete Review validation
export const deleteReviewValidation = [
  check("id")
    .isMongoId()
    .withMessage("wrong id fomate")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await reviewModel.findById(val);
        if (!review) {
          throw new NotFoundError(`review with id =${val} is not found!`);
        }
        if (review.user._id.toString() !== req.user.userId.toString()) {
          throw new PermissionsError("you can delete only your reviews");
        }
      }
      return true;
    }),
  validatorMiddleware,
];

//@desc get single Review validation
export const getReviewValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  validatorMiddleware,
];
