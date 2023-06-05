import reviewModel from "../models/review.model.js";

import {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getList,
} from "./handler-factory.js";

//nested route
export const filterObj = (req, res, next) => {
  if (req.params.produtId) req.filterObj = { product: req.params.productId };
  next();
};

//nested route set product id and loged user to the req.body
export const setProductIdAndUserId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.userId;
  next();
};
//@desc create review
//@route Post api/reviews
//@access pravite/auth user only
export const createReview = createOne(reviewModel);

//@desc get all Reviews
//@route GET api/Reviews
//@access puplic
export const getReviews = getList(reviewModel);

//@desc update Review
//@rout Patch api/reviews/id
//@access pravite/owner of review
export const updateReview = updateOne(reviewModel);

//@desc dalete Review
//@rout Delete api/reviews/id
//@access pravite/admin-manager-owner
export const deleteReview = deleteOne(reviewModel);

//@desc get Review
//@rout GET api/reviews/id
//@access public
export const getReview = getOne(reviewModel);
