import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import productModel from "../../models/product.model.js";
import { NotFoundError } from "../../errors/index.js";

export const addToWishlistValidation = [
  check("productId")
    .notEmpty()
    .withMessage("product is required to add to the wishlist!")
    .isMongoId()
    .withMessage("invalid id formate!")
    .custom(async (val) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new NotFoundError("product with this id is not found!");
      }
      return true;
    }),
  validatorMiddleware,
];

export const removeFromWishlistValidation = [
  param("productId")
    .notEmpty()
    .withMessage("document id is required!")
    .isMongoId()
    .withMessage("invalide id formate"),
  validatorMiddleware,
];
