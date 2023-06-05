import { v4 as uuidv4 } from "uuid";
import { uploadSingleImage } from "../middleware/upload-images.js";
import sharp from "sharp";
import categoryModel from "../models/category.model.js";

import {
  createOne,
  deleteOne,
  getList,
  getOne,
  updateOne,
} from "./handler-factory.js";

export const uploadImage = uploadSingleImage("image");

//@desc change image size and quality
export const resizeImage = async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.webp`;
    await sharp(req.file.buffer)
      .resize({
        width: 600,
        height: 600,
        fit: "cover",
        position: "center",
        background: "white",
      })
      .toFormat("webp")
      .webp({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
  }
  next();
};

//@desc create category
//@route Get api/category
//@access pravite/admin-manager
export const createCategory = createOne(categoryModel);

//@desc get all categoris
//@route GET api/gategory
//@access puplic
export const getCategiories = getList(categoryModel);

//@desc update category
//@rout Patch api/category/id
//@access pravite/admin-manager
export const updateCategory = updateOne(categoryModel);

//@desc dalete category
//@rout Patch api/category/id
//@access pravite/admin
export const deleteCategory = deleteOne(categoryModel);

//@desc get category
//@rout GET api/category/id
//@access public
export const getCategory = getOne(categoryModel);
