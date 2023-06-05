import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { uploadSingleImage } from "../middleware/upload-images.js";
import brandModel from "../models/brand.model.js";

import {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getList,
} from "./handler-factory.js";

export const uploadImage = uploadSingleImage("image");

//@desc change image size and quality
export const resizeImage = async (req, res, next) => {
  console.log("req.file", req.file);
  if (req.file) {
    const filename = `brands-${uuidv4()}-${Date.now()}.webp`;
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
      .toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
  }
  next();
};
//@desc create brand
//@route Get api/brands
//@access pravite/admin-manager
export const createBrand = createOne(brandModel);

//@desc get all brands
//@route GET api/brands
//@access puplic
export const getBrands = getList(brandModel);

//@desc update brand
//@rout Patch api/brands/id
//@access pravite/admin-manager
export const updateBrand = updateOne(brandModel);

//@desc dalete brand
//@rout Patch api/brands/id
//@access pravite/admin
export const deleteBrand = deleteOne(brandModel);

//@desc get brand
//@rout GET api/brands/id
//@access public
export const getBrand = getOne(brandModel);
