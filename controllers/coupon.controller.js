import couponModel from "../models/coupon.model.js";

import {
  createOne,
  deleteOne,
  getList,
  getOne,
  updateOne,
} from "./handler-factory.js";

//@desc create coupon
//@route POST api/coupons
//access private/admin-manager
export const createCoupon = createOne(couponModel);

//@desc get coupon
//@route GET api/coupons/:id
//access private/admin-manager
export const getCoupon = getOne(couponModel);

//@desc get coupons
//@route GET api/coupons
//access private/admin-manager
export const getCoupons = getList(couponModel);

//@desc update coupon
//@route PATCH api/coupons/:id
//access private/admin-manager
export const updateCoupon = updateOne(couponModel);

//@desc delete coupon
//@route DELETE api/coupons/:id
//access private/admin-manager
export const deleteCoupon = deleteOne(couponModel);
