import paytabs from "paytabs_pt2";
import cartModel from "../models/cart.model.js";
import { NotFoundError } from "../errors/index.js";
import userModel from "../models/user.model.js";

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
      const cart = await cartModel.findById(req.body.cart_id);
      if (!cart) {
        return res.status(404).json({ message: "cart is not found!" });
      }
      const user = await userModel.findOne({
        email: req.body.customer_details.email,
      });
      if (!user) {
        return res.status(404).json({ message: "user is not found!" });
      }
      const shipping_address = {
        details: req.body.customer_details.street1,
        city: req.body.customer_details.city,
        postalCode: req.body.customer_details.zip,
        phone: req.body.customer_details.phone,
      };
      console.log("true");
      console.log("cart", cart);
      console.log("cart", cart);
      console.log("shipping_address", shipping_address);
    }
  }
  paytabs.validatePayment(req.body.tran_ref, verifyPayment);
  res.send("");
};
