import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import couponModel from "../models/coupon.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const totalPriceCalc = (cart) => {
  let totalPrice = 0;
  cart.cartItems.map((item) => {
    totalPrice = totalPrice + parseInt(item.quantity) * parseFloat(item.price);
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDisc = 0;
};

//@desc create cart
//@route POST api/cart
//@access pravite/user
export const createCart = async (req, res) => {
  const { productId, quantity, color } = req.body;
  const product = await productModel.findById(productId);

  if (!product) {
    throw new NotFoundError(`product with id=${productId} is not found!`);
  }
  if (product.quantity <= 0) {
    throw new BadRequestError("this product is out of sales!");
  }
  if (product.quantity < quantity) {
    throw new BadRequestError(
      "this quantity is greater than product quantity in the stock!"
    );
  }
  let cart = await cartModel.findOne({ user: req.user.userId });

  if (cart) {
    const itemIndex = cart.cartItems.findIndex(
      (item) =>
        item.product._id.toString() === productId && item.color === color
    );
    if (itemIndex > -1) {
      if (cart.cartItems[itemIndex].quantity + 1 > product.quantity) {
        throw new BadRequestError(
          "this quantity is greater than product quantity in the stock!"
        );
      }
      cart.cartItems[itemIndex].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        quantity: quantity ? quantity : 1,
        price: product.price,
      });
    }
    console.log(itemIndex);
  } else {
    cart = await cartModel({
      cartItems: [
        {
          product: productId,
          color,
          quantity: quantity ? quantity : 1,
          price: product.price,
        },
      ],
      user: req.user.userId,
    });
  }

  totalPriceCalc(cart);

  await cart.save();
  res.status(200).json({
    message: "product added to your cart",
    cartLength: cart.cartItems.length,
    data: cart,
  });
};

//@desc get user cart
//@route Get api/cart
//@access pravite/user
export const getCart = async (req, res) => {
  const cart = await cartModel.findOne({ user: req.user.userId });

  if (!cart) {
    throw new NotFoundError("cart is not found!");
  }

  res.status(200).json({
    cartLength: cart.cartItems.length,
    data: cart,
  });
};

//@desc delete item from user cart
//@route Delete api/cart
//@access pravite/user
export const deleteItemFromCart = async (req, res) => {
  const { itemId } = req.params;
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user.userId },
    {
      $pull: { cartItems: { _id: itemId } },
    },
    { new: true }
  );

  if (!cart) {
    throw new NotFoundError("cart is not found!");
  }
  totalPriceCalc(cart);
  await cart.save();
  res.status(200).json({
    cartLength: cart.cartItems.length,
    data: cart,
  });
};

//@desc update item in user cart
//@route Patch api/cart
//@access pravite/user
export const updateItemInCart = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user.userId });

  if (!cart) {
    throw new NotFoundError("cart is not found!");
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity = quantity;
  }

  totalPriceCalc(cart);
  await cart.save();
  res.status(200).json({
    cartLength: cart.cartItems.length,
    data: cart,
  });
};

//@desc clear user cart
//@route DELETE api/cart
//@access pravite/user
export const clearCart = async (req, res) => {
  const cart = await cartModel.findOneAndDelete({ user: req.user.userId });
  if (!cart) {
    throw new NotFoundError("cart is not found!");
  }
  res.status(200).json({
    message: "cart is deleted!",
  });
};

//@desc apply coupon discount
//@route Patch api/cart/applycoupon
//@access pravite/user
export const applyCoupon = async (req, res) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expireAt: { $gt: Date.now() },
  });
  if (!coupon) {
    throw new NotFoundError(
      `coupon with name:${req.body.coupon} is not found or expired!`
    );
  }
  const cart = await cartModel.findOne({ user: req.user.userId });
  if (!cart) {
    throw new NotFoundError("cart is not found!");
  }
  const totalPrice = parseInt(cart.totalPrice);
  const couponDis = coupon.discount;
  const dicountPrice = totalPrice - totalPrice * (couponDis / 100);
  cart.totalPriceAfterDisc = dicountPrice;
  await cart.save();

  res.status(200).json({
    message: "coupon is applied",
    cartLength: cart.cartItems.length,
    data: cart,
  });
};
