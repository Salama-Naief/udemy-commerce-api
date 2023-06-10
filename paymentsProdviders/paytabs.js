import paytabs from "paytabs_pt2";
import cartModel from "../models/cart.model.js";
import { NotFoundError } from "../errors/index.js";
import userModel from "../models/user.model.js";
import updateProdutAfterOrder from "../utils/updateProductAfterOrder.js";
import orderModel from "../models/order.model.js";

export const PayWithPaytabs = async (req, res) => {
  //paytabs configrations
  const profileID = process.env.PAYTABS_PROFILE_ID;
  const serverKey = process.env.PAYTABS_SERVER_KEY;
  const region = "EGY";
  paytabs.setConfig(profileID, serverKey, region);

  const { shippingAddress } = req.body;
  const cart = await cartModel.findOne({ user: req.user.userId });
  if (!cart) {
    throw new NotFoundError("this user not have a cart");
  }

  process.host;

  const paymentMethods = ["all"];
  const transaction = {
    type: "sale",
    class: "ecom",
  };

  const orderPrice = cart.totalPriceAfterDisc
    ? cart.totalPriceAfterDisc
    : cart.totalPrice;
  let cartitems = {
    id: cart._id,
    currency: "EGP",
    amount: orderPrice,
    description: req.user.name,
  };

  const transaction_details = [transaction.type, transaction.class];

  const cart_details = [
    cartitems.id,
    cartitems.currency,
    cartitems.amount,
    cartitems.description,
  ];

  const customer = {
    name: req.user.name,
    email: req.user.email,
    phone: shippingAddress.phone,
    street1: shippingAddress.details,
    city: shippingAddress.city,
    state: shippingAddress.city,
    country: shippingAddress.country,
    zip: shippingAddress.postalCode,
  };

  let customer_details = [
    customer.name,
    customer.email,
    customer.phone,
    customer.street,
    customer.city,
    customer.state,
    customer.country,
    customer.zip,
    customer.IP,
  ];

  let shipping_address = customer_details;

  let url = {
    //  callback: `${process.env.BASE_URL}/paytabs-webhooks`,
    response: process.env.PAYMENT_SUCCESS_URL,
  };
  let response_URLs = [url.response /*url.callback*/];

  let lang = "ar";

  const paymentPageCreated = function (results) {
    if (Object.keys(results)[0] !== "response_code:") {
      return res.status(200).json({ sessionUri: results.redirect_url });
    } else {
      return res
        .status(500)
        .json({ message: "something went wrong in the server!" });
    }
  };

  // let frameMode = true;

  paytabs.createPaymentPage(
    paymentMethods,
    transaction_details,
    cart_details,
    customer_details,
    shipping_address,
    response_URLs,
    lang,
    paymentPageCreated
  );
};

//function that create order
const createCardOrder = async (data) => {
  const cartId = data.cart_id;
  const shippingAddress = {
    details: data.customer_details.street1,
    city: data.customer_details.city,
    postalCode: data.customer_details.zip,
    phone: data.customer_details.phone,
  };
  const orderPrice = data.tran_total;
  const cart = await cartModel.findById(cartId);
  const user = await userModel.findOne({ email: data.customer_details.email });

  // 3) Create order with default paymentMethodType card
  const order = await orderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    updateProdutAfterOrder(cart);

    // 5) Clear cart depend on cartId
    await cartModel.findByIdAndDelete(cartId);
  }
};
export const paytabsWebhooks = async (req, res) => {
  const sig = req.headers["signature"];
  console.log("Signature", sig);
  console.log("Signature body", req.body);

  async function verifyPayment(result) {
    if (result["response_code:"] === 400) {
      console.log("false");
      return res
        .status(400)
        .json({ message: "something went wrong in the payment!" });
    } else {
      createCardOrder(req.body);
    }
  }
  paytabs.validatePayment(req.body.tran_ref, verifyPayment);
  res.send("");
};
