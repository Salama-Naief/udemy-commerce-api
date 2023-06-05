import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import slugify from "slugify";

//@desc create Brand validations
export const createBrandValidation = [
  check("title")
    .notEmpty()
    .withMessage("Brand title must not be empity")
    .isLength({ min: 3 })
    .withMessage("Brand title too short")
    .isLength({ max: 32 })
    .withMessage("Brand title too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

//@desc update Brand validation
export const updateBrandValidation = [
  param("id").isMongoId().withMessage("wrong id formate"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

//@desc delete Brand validation
export const deleteBrandValidation = [
  check("id").isMongoId().withMessage("wrong id fomate"),
  validatorMiddleware,
];

//@desc get single Brand validation
export const getBrandValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  validatorMiddleware,
];
