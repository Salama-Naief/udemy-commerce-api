import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import { uploadSingleImage } from "../middleware/upload-images.js";
import localUserModel from "../models/local-user.model.js";

import { deleteOne, getOne, createOne, getList } from "./handler-factory.js";
import { NotFoundError } from "../errors/index.js";

export const uploadImage = uploadSingleImage("profileImg");

//@desc change image size and quality
export const resizeImage = async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.webp`;
    await sharp(req.file.buffer)
      .resize({
        width: 400,
        height: 400,
        fit: "cover",
        position: "center",
        background: "white",
      })
      .toFormat("webp")
      .webp({ quality: 85 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }
  next();
};
//@desc create user
//@route Get api/users
//@access pravite
export const createUser = createOne(localUserModel);

//@desc get all users
//@route GET api/users
//@access pravite/admin
export const getUsers = getList(localUserModel);

//@desc update user fields
const updateFun =
  (Model, type = "") =>
  async (req, res) => {
    const { id } = req.params;
    const { password, role, ...othersQuery } = req.body;
    let user = {};

    if (type === "password" && password) {
      user = await Model.findByIdAndUpdate(
        req.user.userId,
        {
          password: await bcrypt.hash(password, 10),
          changePasswordAt: Date.now(),
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else if (type === "chageRole") {
      user = await Model.findByIdAndUpdate(
        id,
        {
          role,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      user = await Model.findByIdAndUpdate(id, othersQuery, {
        new: true,
        runValidators: true,
      });
    }

    if (!user) {
      throw new NotFoundError(`user with this id=${id} is not found`);
    }
    res.status(200).json({ data: user });
  };
//@desc update user fields accept password
//@rout Patch api/user/id
//@access pravite.admin-user for him self (chage every thing execpt role and password)
export const updateUser = updateFun(localUserModel);

//@desc update user  password field
//@rout Patch api/users/changepassword
//@access pravite/auth
export const changePassword = updateFun(localUserModel, "password");

//@desc admin can change user role
//@rout Patch api/users/changerole/id
//@access pravite/admin
export const changeRole = updateFun(localUserModel, "chageRole");

//@desc dalete User
//@rout Patch api/users/id
//@access pravite/admin
export const deleteUser = deleteOne(localUserModel);

//@desc get user
//@rout GET api/users/id
//@access pravite/admin
export const getUser = getOne(localUserModel);
