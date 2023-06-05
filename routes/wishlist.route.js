import express from "express";
import {
  addToWishList,
  getWishList,
  removeFromWishList,
} from "../controllers/wishlist.controller.js";
import {
  addToWishlistValidation,
  removeFromWishlistValidation,
} from "../utils/validations/wishlist-validator.js";

import { auth, permissions } from "../middleware/protection.middleware.js";
const router = express.Router();

router.use(auth, permissions("user"));
router.route("/").post(addToWishlistValidation, addToWishList).get(getWishList);
router
  .route("/:productId")
  .delete(removeFromWishlistValidation, removeFromWishList);
export default router;
