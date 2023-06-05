import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

import { deleteOne, updateOne, getOne, getList } from "./handler-factory.js";
import { ApiError, NotFoundError } from "../errors/index.js";

//@desc create cash order
//@route POST api/order/cash
//@access pravite/user
export const createCashOrder = async (req, res) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const { shippingAddress } = req.body;
  //1) get cartItem data
  const cart = await cartModel.findOne({ user: req.user.userId });
  if (!cart) {
    throw new NotFoundError("this user not have cartItems!");
  }
  //2) check applied coupon
  const cartPrice = cart.totalPriceAfterDisc
    ? cart.totalPriceAfterDisc
    : cart.totalPrice;
  const orderPrice = cartPrice + taxPrice + shippingPrice;
  //3) create cash order
  const order = await orderModel.create({
    user: req.user.userId,
    orderPrice,
    shippingAddress,
    cartItems: cart.cartItems,
  });
  if (!order) {
    throw new ApiError("something went wrong,please try again!");
  }
  //4) update product quantity and numOfSales
  const bulkWriteOp = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, nomOfSales: item.quantity } },
    },
  }));
  await productModel.bulkWrite(bulkWriteOp, {});
  //5) clear cartItems
  await cartModel.findOneAndDelete({ user: req.user.userId });
  await order.save();
  res
    .status(200)
    .json({ massage: "cash order is created successfully :)", data: order });
};

export const filterObj = (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user.userId };
  next();
};
//@desc get orders
//@route GET api/order
//@access pravite/user-admin-manager
export const getOrders = getList(orderModel);

//@desc update order to paid
//@rout Patch api/order/id
//@access pravite/admin-manager
export const updateOrderToPaid = async (req, res) => {
  const { id } = req.params;
  const order = await orderModel.findById(id);
  if (!order) {
    throw new NotFoundError(`order with id:${id} is not found!`);
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json({ message: "order updated successfully", data: order });
};

//@desc update order to deleverd
//@rout Patch api/order/id
//@access pravite/admin-manager
export const updateOrderToDelevered = async (req, res) => {
  const { id } = req.params;
  const order = await orderModel.findById(id);
  if (!order) {
    throw new NotFoundError(`order with id:${id} is not found!`);
  }
  order.isDelevered = true;
  order.deleveredAt = Date.now();
  await order.save();
  res.status(200).json({ message: "order updated successfully", data: order });
};

//@desc dalete brand
//@rout Patch api/brands/id
//@access pravite/admin
export const deleteBrand = deleteOne(orderModel);

//@desc get order
//@rout GET api/order/id
//@access pravite/user-admin-manager
export const getOrder = getOne(orderModel);
