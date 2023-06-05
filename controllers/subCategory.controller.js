import subCategoryModel from "../models/subCategory.model.js";

import {
  createOne,
  deleteOne,
  getList,
  getOne,
  updateOne,
} from "./handler-factory.js";

//@desc set req.params to req.body middleware to cross validation layerd
export const setParamsToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
export const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
//@desc create subcategory
//@route POST api/subcategories
//access private/admin-manager
export const creatSubcategory = createOne(subCategoryModel);

//@desc create subcategory
//@route GET api/subcategories/:id
//access public
export const getSubcategory = getOne(subCategoryModel);

//@desc create subcategories
//@route GET api/subcategories
//access public
export const getSubcategories = getList(subCategoryModel);

//@desc update subcategory
//@route PATCH api/subcategories/:id
//access private/admin-manager
export const updateSubcategory = updateOne(subCategoryModel);

//@desc delete subcategory
//@route DELETE api/subcategories/:id
//access private/admin
export const deleteSubcategory = deleteOne(subCategoryModel);
