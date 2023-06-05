import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import categoryModel from "../../models/category.model.js";
import subcategoryModel from "../../models/subCategory.model.js";
import brandModel from "../../models/brand.model.js";
import slugify from "slugify";

export const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("you must enter product title")
    .isLength({ min: 3 })
    .withMessage("title is too short")
    .isLength({ max: 200 })
    .withMessage("title is too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("you must enter product description")
    .isLength({ min: 20 })
    .withMessage("description is too short"),
  check("price")
    .notEmpty()
    .withMessage("you must enter the product price")
    .isNumeric()
    .withMessage("price must be number"),
  check("quantity")
    .notEmpty()
    .withMessage("you must enter the product quantity")
    .isNumeric()
    .withMessage("price must be number"),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("discount must be less than price");
      } else {
        return true;
      }
    }),
  check("category")
    .notEmpty()
    .withMessage("you must choose the category for this product")
    .isMongoId()
    .withMessage("wrong id formate")
    .custom(async (categoryId) => {
      const cate = await categoryModel.findById(categoryId);
      console.log("cate", cate);
      if (!cate) {
        throw new Error(`no category found with id=${categoryId}`);
      }

      return true;
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("wrong id formate")
    .custom(async (brandId) => {
      const brand = await brandModel.findById(brandId);
      if (!brand) {
        return Promise.reject(new Error(`no brand found with id=${brandId}`));
      }
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("wrong id formate")
    .custom(async (subcategoryIds, { req }) => {
      const uniqIds = [...new Set(subcategoryIds)];
      console.log(uniqIds);
      const subcategories = await subcategoryModel.find({
        _id: { $exists: true, $in: uniqIds },
        category: req.body.category,
      });
      if (
        subcategories.length <= 0 ||
        subcategories.length !== subcategoryIds.length
      ) {
        return Promise.reject(
          new Error(
            "invalid subcategory ids or subcategory not blengs to category sellected"
          )
        );
      }
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be array of strings"),
  check("coverImage").notEmpty().withMessage("you must choose cover image"),
  check("images").optional().isArray().withMessage("images should be an array"),
  validatorMiddleware,
];

//@desc get product validation
export const getProductValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  validatorMiddleware,
];

//@desc update product validation
export const updateProductValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

//@desc get product validation
export const deleteProductValidation = [
  check("id").isMongoId().withMessage("wrong id formate"),
  validatorMiddleware,
];
