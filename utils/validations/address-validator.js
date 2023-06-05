import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import userModel from "../../models/user.model.js";
import { BadRequestError } from "../../errors/index.js";

export const addAddressValidation = [
  check("alias")
    .notEmpty()
    .withMessage("address alias is required!")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.user.userId);
      const existAlais = user.addresses.find(
        (address) => address.alias === val
      );
      console.log("existAlais", existAlais);
      if (existAlais) {
        throw new BadRequestError("this alias is used, please use anther one");
      }
      return true;
    }),
  check("city").notEmpty().withMessage("please enter city"),
  check("details").notEmpty().withMessage("please enter the address details"),
  check("postalCode")
    .notEmpty()
    .withMessage("please enter postalCode")
    .isPostalCode("any"),
  check("phone")
    .notEmpty()
    .withMessage("please enter your phone number")
    .isMobilePhone(["ar-EG"])
    .withMessage("only egypt phone numbers is accepted"),
  validatorMiddleware,
];

export const removeAddressValidation = [
  param("id")
    .notEmpty()
    .withMessage("document id is required!")
    .isMongoId()
    .withMessage("invalide id formate"),
  validatorMiddleware,
];
