import sharp from "sharp";
import { v4 as uuidV4 } from "uuid";
import productModel from "../models/product.model.js";
import { uploadMixImage } from "../middleware/upload-images.js";
import {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getList,
} from "./handler-factory.js";

//@desc upload mix images
export const uploadProductImages = uploadMixImage();
//@desc resize product images
export const resizeImages = async (req, res, next) => {
  if (req.files.coverImage) {
    const coverImageName = `product-${uuidV4()}-${Date.now()}-cover.webp`;
    await sharp(req.files.coverImage[0].buffer)
      .resize({ width: 2000, height: 1333, fit: "cover", background: "white" })
      .toFormat("webp")
      .webp({ quality: 95 })
      .toFile(`uploads/products/${coverImageName}`);
    req.body.coverImage = coverImageName;
  }
  //
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidV4()}-${Date.now()}-${index + 1}-${
          index + 1
        }.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("webp")
          .webp({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
};
//@desc create product
//@route Get api/products
//@access pravite/admin-manager
export const createProduct = createOne(productModel);

//@desc get all products
//@route GET api/products
//@access puplic
export const getProducts = getList(productModel);

//@desc update product
//@rout Patch api/products/id
//@access pravite/admin-manager
export const updateProduct = updateOne(productModel);

//@desc dalete product
//@rout Patch api/products/id
//@access pravite/admin
export const deleteProduct = deleteOne(productModel);

//@desc get product
//@rout GET api/products/id
//@access public
export const getProduct = getOne(productModel, "reviews");
