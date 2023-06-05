import multer from "multer";
import BadRequestError from "../errors/bad-request.error.js";

const uploadFiles = () => {
  //1)-desc to upload file with full size
  //using multer diskstorage engine
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/category");
  //   },
  //   filename: function (req, file, cb) {
  //     const extention = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${extention}`;
  //     cb(null, filename);
  //   },
  // });

  //2)-upload files using memorystorage engine

  const storage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new BadRequestError("only image can be uploaded"), false);
    }
  };
  const uploads = multer({ storage: storage, fileFilter: multerFilter });
  return uploads;
};

//@desc upload single image
export const uploadSingleImage = (fieldName) => uploadFiles().single(fieldName);

//@desc upload multiImages or mix of images
export const uploadMixImage = () =>
  uploadFiles().fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]);
