import { check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import userModel from "../../models/user.model.js";
import { BadRequestError } from "../../errors/index.js";

export const signupValidation = [
  check("name")
    .notEmpty()
    .withMessage("user name is required")
    .isLength({ min: 3 })
    .withMessage("name is too short"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalide email formate")
    .custom(async (val) => {
      const user = await userModel.findOne({ email: val });
      if (user) {
        return Promise.reject(
          new BadRequestError("this email is already registered!")
        );
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isStrongPassword()
    .withMessage(
      "password must contain at least number,char uppercase ,char lowercase and special char exp:Aa#123456"
    )
    .isLength({ min: 8 })
    .withMessage("password is too short")
    .custom((val, { req }) => {
      if (req.body.confirmPassword !== val) {
        throw new BadRequestError("confirm password not match password");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),
  validatorMiddleware,
];

export const loginValidation = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalide email formate"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isStrongPassword()
    .withMessage(
      "password must contain at least number,char uppercase ,char lowercase and special char exp:Aa#123456"
    )
    .isLength({ min: 8 })
    .withMessage("password is too short"),
  validatorMiddleware,
];

export const sendResetCodeValidation = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalide email formate"),
  validatorMiddleware,
];

export const verifyCodeValidation = [
  check("resetCode")
    .notEmpty()
    .withMessage("email is required")
    .isLength({ max: 6 })
    .withMessage("reset code lenght must be 6!")
    .isLength({ min: 6 })
    .withMessage("reset code lenght must be 6!"),
  validatorMiddleware,
];

export const setNewPassValidation = [
  check("password")
    .notEmpty()
    .withMessage("password is required!")
    .isStrongPassword()
    .withMessage(
      "new password must contain at least number,char uppercase ,char lowercase and special char exp:Aa#123456"
    )
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new BadRequestError("password and confirm password not matchs!");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirnPassword is required!"),
  validatorMiddleware,
];
