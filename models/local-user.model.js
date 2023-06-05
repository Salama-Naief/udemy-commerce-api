import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./user.model.js";

const localUserSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minLenght: 8,
      select: false,
    },
    changePasswordAt: {
      type: Date,
      select: false,
    },
    passwordResetCode: { type: String, select: false },
    passwordResetCodeExpires: { type: Date, select: false },
    passwordResetCodeVerified: { type: Boolean, select: false },
  },
  { timestamps: true }
);

localUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

localUserSchema.method("isMatchPassword", function (password) {
  return bcrypt.compare(password, this.password);
});

localUserSchema.method("token", function (paylaod) {
  const token = jwt.sign(paylaod, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
});

export default userModel.discriminator("Local", localUserSchema);
