import crypto from "crypto";
import bcrypt from "bcryptjs";
import localUserModel from "../models/local-user.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

//@desc signup
//@route GET api/auth/signup
//@access public
export const signup = async (req, res) => {
  const newUser = await localUserModel.create(req.body);
  const token = newUser.token({ userId: newUser._id });
  const { password, ...others } = newUser._doc;
  res.status(201).json({ data: others, token });
};

//@desc login
//@route GET api/auth/login
//@access public
export const login = async (req, res) => {
  const user = await localUserModel
    .findOne({ email: req.body.email })
    .select("+password");
  console.log("loged user", user);
  if (!user) {
    throw new BadRequestError("invalid email or password");
  }
  const isMatch = await user.isMatchPassword(req.body.password);
  console.log("isMatch", isMatch);
  if (!isMatch) {
    throw new BadRequestError("invalid email or password");
  }
  const token = await user.token({ userId: user._id });
  const { password, ...others } = user._doc;

  res.status(201).json({ data: others, token });
};

//@desc send reset code
//@route POST api/auth/restcode
//@access public
export const sendResetCode = async (req, res) => {
  const { email } = req.body;
  const user = await localUserModel.findOne({ email });

  if (!user) {
    throw new NotFoundError(`user with email=${email} is not found!`);
  }

  //generate reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("resetCode", resetCode);
  //hash reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  console.log("hashResetCode", user);
  //save hashed resetCode id db

  user.passwordResetCode = hashResetCode;
  user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetCodeVerified = false;
  await user.save();

  //send rest code to email
  res.status(200).json({ message: "resetCode was sent to your email !" });
};

//@desc verify resetCode
//@route POST api/auth/verifyCode
//@access public
export const verifyCode = async (req, res) => {
  const { resetCode } = req.body;
  //hash reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  console.log("hashResetCode verify", hashResetCode);
  console.log("resetcode", resetCode);
  const user = await localUserModel.findOne({
    passwordResetCode: hashResetCode,
    passwordResetCodeExpires: { $gt: Date.now() },
  });
  console.log("usr", user);
  if (!user) {
    throw new NotFoundError("invalid resetCode or expires!");
  }

  //reset value in deta base
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetCodeVerified = true;
  await user.save();

  res.status(200).json({ message: "success code!" });
};

//@desc set new Password
//@route Patich api/auth/setPassword
//@access public
export const setNewPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await localUserModel.findOne({
    email,
    passwordResetCodeVerified: true,
  });
  if (!user) {
    throw new NotFoundError("user is not found or resetCode not verified!");
  }

  //save hashed resetCode id db
  //reset value in deta base
  user.passwordResetCodeVerified = undefined;
  user.password = password;
  await user.save();

  const token = await user.token({ userId: user._id });
  res.status(200).json({ token });
};
