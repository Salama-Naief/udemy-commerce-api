import Stripe from "stripe";
import cartModel from "../models/cart.model.js";
import { NotFoundError } from "../errors/index.js";
import userModel from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const payWithStripe = async (req, res) => {
  // comes from app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  const { cartId } = req.params;
  const cart = await cartModel.findById(cartId);
  if (!cart) {
    throw new NotFoundError(`cart with id:${cartId} is not found!`);
  }
  const line_items = cart.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          images: [item.product.coverImage],
          description: "ded",
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });
  // const cartPrice = cart.totalPriceAfterDisc
  //   ? cart.totalPriceAfterDisc
  //   : cart.totalPrice;
  // const orderPrice = cartPrice + taxPrice + shippingPrice;

  // const customer = await stripe.customers.create({
  //   metadata: {
  //     userId: req.user.userId,
  //     cart: cart.cartItems,
  //   },
  // });

  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    client_reference_id: cartId,
    submit_type: "donate",
    //customer: customer.id,
    //billing_address_collection: "",
    // shipping_address_collection: {
    //   allowed_countries: ["EG", "CA"],
    // },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    line_items,
    mode: "payment",
    metadata: req.body.shippingAddress,
    success_url: `${process.env.FRONTEND_URL}?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
    // automatic_tax: { enabled: true },
  });

  res.json(session);
};

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;
  const shippingPrice = (session.amount_total - session.amount_subtotal) / 100;

  const cart = await cartModel.findById(cartId);
  const user = await userModel.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await orderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    orderPrice,
    shippingPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await cartModel.findByIdAndDelete(cartId);
  }
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
export const webhookCheckout = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event = null;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
};
