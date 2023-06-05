import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import slugify from "slugify";

//@desc create category validations
export const createSubCategoryValidation = [
  check("title")
    .notEmpty()
    .withMessage("title must not be empity")
    .isLength({ min: 2 })
    .withMessage("Subcategory title too short")
    .isLength({ max: 32 })
    .withMessage("Subcategory title too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("parent category must be enterd")
    .isMongoId()
    .withMessage("wong parent id formate"),
  validatorMiddleware,
];

//@desc update Subcategory validation
export const updateSubCategoryValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

//@desc delete Subcategory validation
export const deleteSubCategoryValidation = [
  check("id").isMongoId().withMessage("wrong id fomate"),
  validatorMiddleware,
];

//@desc get single Subcategory validation
export const getSubCategoryValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  validatorMiddleware,
];
