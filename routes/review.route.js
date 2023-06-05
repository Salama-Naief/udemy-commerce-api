import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
  filterObj,
  setProductIdAndUserId,
} from "../controllers/review.controller.js";
import {
  createReviewValidation,
  deleteReviewValidation,
  getReviewValidation,
  updateReviewValidation,
} from "../utils/validations/review-validator.js";

import { auth, permissions } from "../middleware/protection.middleware.js";
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth,
    permissions("user"),
    setProductIdAndUserId,
    createReviewValidation,
    createReview
  )
  .get(filterObj, getReviews);
router
  .route("/:id")
  .get(getReviewValidation, getReview)
  .patch(auth, permissions("user"), updateReviewValidation, updateReview)
  .delete(
    auth,
    permissions("admin", "user", "manager"),
    deleteReviewValidation,
    deleteReview
  );
export default router;
