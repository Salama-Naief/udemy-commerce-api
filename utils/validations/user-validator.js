import { param, check } from "express-validator";
import { validatorMiddleware } from "../../middleware/validator.middleware.js";
import userModel from "../../models/user.model.js";
import localUserModel from "../../models/local-user.model.js";
import { BadRequestError } from "../../errors/index.js";

export const createUserValidation = [
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("invalide phone number"),
  validatorMiddleware,
];

export const updateUserValidation = [
  param("id")
    .notEmpty()
    .withMessage("document id is required")
    .isMongoId()
    .withMessage("invalide id formate"),
  check("email")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("invalid phone number accept only engypt number"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("name is too short"),
  validatorMiddleware,
];

export const getUserValidation = [
  param("id")
    .notEmpty()
    .withMessage("document id is required")
    .isMongoId()
    .withMessage("invalide id formate"),
  validatorMiddleware,
];

export const deleteUserValidation = [
  param("id")
    .notEmpty()
    .withMessage("document id is required")
    .isMongoId()
    .withMessage("invalide id formate"),
  validatorMiddleware,
];

export const changePasswordValidation = [
  check("oldPassword")
    .notEmpty()
    .withMessage("password is required")
    .custom(async (val, { req }) => {
      const user = await localUserModel
        .findById(req.user.userId)
        .select("+password");
      const isMacht = await user.isMatchPassword(val);
      if (!isMacht) {
        return Promise.reject(new BadRequestError("wrong password"));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 8 })
    .withMessage("password is too short")
    .isStrongPassword()
    .withMessage(
      "password must contain at least number,char uppercase ,char lowercase and special char exp:Aa#123456"
    )
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new BadRequestError("confirm password not match password");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),
  validatorMiddleware,
];

export const changeRoleValidation = [
  param("id")
    .notEmpty()
    .withMessage("document id is required")
    .isMongoId()
    .withMessage("invalide id formate"),
  check("role")
    .notEmpty()
    .withMessage("role is required")
    .custom((val) => {
      const roles = ["admin", "manager", "user"];
      if (!roles.includes(val)) {
        throw new BadRequestError("wrong role!");
      }
      return true;
    }),
  validatorMiddleware,
];
