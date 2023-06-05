import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import slugify from "slugify";

//@desc create category validations
export const createCategoryValidation = [
  check("title")
    .notEmpty()
    .withMessage("title must not be empity")
    .isLength({ min: 3 })
    .withMessage("category title too short")
    .isLength({ max: 32 })
    .withMessage("category title too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

//@desc update category validation
export const updateCategoryValidation = [
  param("id").isMongoId().withMessage("wrong id formate"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

//@desc delete category validation
export const deleteCategoryValidation = [
  check("id").isMongoId().withMessage("wrong id fomate"),
  validatorMiddleware,
];

//@desc get single category validation
export const getCategoryValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  validatorMiddleware,
];
