import {
  NotFoundError,
  UnauthenticatedError,
  PermissionsError,
} from "../errors/index.js";

import jwt from "jsonwebtoken";
import localUserModel from "../models/local-user.model.js";

//@desc check user authentication
export const auth = async (req, res, next) => {
  //check the token in req headers
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    throw new UnauthenticatedError("not authorized please longin!");
  }

  if (!token) {
    throw new UnauthenticatedError("not authorized please longin!");
  }
  //verify the token

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await localUserModel.findById(decoded.userId);
  if (!currentUser) {
    throw new NotFoundError(`user with id=${decoded.userId} is not found`);
  }
  if (currentUser.changePasswordAt) {
    const passChagedAtStamp = parseInt(
      currentUser.changePasswordAt.getTime() / 1000
    );
    if (passChagedAtStamp > decoded.iat) {
      throw new UnauthenticatedError(
        "token expired or invalid ,please loging again!"
      );
    }
  }
  req.user = {
    userId: currentUser._id,
    email: currentUser.email,
    role: currentUser.role,
    name: currentUser.name,
    phone: currentUser.phone,
  };
  next();
};

//@desc check user permissions (authorization)
export const permissions =
  (...roles) =>
  async (req, res, next) => {
    if (req.user) {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        throw new PermissionsError("You not allowed to access this route");
      }
    } else {
      throw new UnauthenticatedError("unauthorized ,please login!");
    }
  };
export const userAdminPermissions =
  (...roles) =>
  (req, res, next) => {
    if (
      roles.includes(req.user.role) ||
      req.user.userId.toString() === req.params.id
    ) {
      next();
    } else {
      throw new PermissionsError("You not allowed to access this route");
    }
  };
