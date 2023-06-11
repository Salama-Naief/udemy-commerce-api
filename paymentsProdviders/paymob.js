import axios from "axios";
import { NotFoundError } from "../errors/index.js";
import cartModel from "../models/cart.model.js";

export const payWithPaymob = async (req, res) => {
  console.log("pay with paymob");

  const { data } = await axios.post(
    "https://accept.paymob.com/api/auth/tokens",
    {
      api_key: process.env.PAYMOB_API_KEY,
    }
  );
  console.log("data", data.token);
  stepTwo(data.token, req, res);
};

const stepTwo = async (token, req, res) => {
  const { shippingAddress } = req.body;
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  //const { cartId } = req.params;
  const cart = await cartModel.findOne({ user: req.user.userId });
  if (!cart) {
    throw new NotFoundError("no cart found for this user");
  }

  const cartPrice = cart.totalPriceAfterDisc
    ? cart.totalPriceAfterDisc
    : cart.totalPrice;
  const orderPrice = cartPrice + taxPrice + shippingPrice;

  const items = cart.cartItems.map((item) => ({
    name: item.product.title,
    amount_cents: item.price * 100,
    description: item.product.description,
    quantity: item.quantity,
  }));

  const orderData = {
    auth_token: token,
    delivery_needed: "false",
    amount_cents: orderPrice * 100,
    currency: "EGP",
    // merchant_order_id: cart._id,
    items: cart.cartItems,
    shipping_data: shippingAddress,
  };

  console.log(items);
  // const orderData = {
  //   auth_token: token,
  //   delivery_needed: "false",
  //   amount_cents: orderPrice * 100,
  //   currency: "EGP",
  //   items: items,
  //   shipping_data: {
  //     apartment: "803",
  //     email: "claudette09@exa.com",
  //     floor: "42",
  //     first_name: "Clifford",
  //     street: "Ethan Land",
  //     building: "8028",
  //     phone_number: "+86(8)9135210487",
  //     postal_code: "01898",
  //     extra_description: "8 Ram , 128 Giga",
  //     city: "Jaskolskiburgh",
  //     country: "CR",
  //     last_name: "Nicolas",
  //     state: "Utah",
  //   },
  // };
  // const orderData = {
  //   auth_token: token,
  //   delivery_needed: "false",
  //   amount_cents: "100",
  //   currency: "EGP",
  //   //merchant_order_id: 9,
  //   items: [
  //     {
  //       name: "ASC1515",
  //       amount_cents: "500000",
  //       description: "Smart Watch",
  //       quantity: "1",
  //     },
  //     {
  //       name: "ERT6565",
  //       amount_cents: "200000",
  //       description: "Power Bank",
  //       quantity: "1",
  //     },
  //   ],
  //   shipping_data: {
  //     apartment: "803",
  //     email: "claudette09@exa.com",
  //     floor: "42",
  //     first_name: "Clifford",
  //     street: "Ethan Land",
  //     building: "8028",
  //     phone_number: "+86(8)9135210487",
  //     postal_code: "01898",
  //     extra_description: "8 Ram , 128 Giga",
  //     city: "Jaskolskiburgh",
  //     country: "CR",
  //     last_name: "Nicolas",
  //     state: "Utah",
  //   },
  //   shipping_details: {
  //     notes: " test",
  //     number_of_packages: 1,
  //     weight: 1,
  //     weight_unit: "Kilogram",
  //     length: 1,
  //     width: 1,
  //     height: 1,
  //     contents: "product of some sorts",
  //   },
  // };
  try {
    const { data } = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      orderData
    );
    stepThree(token, data.id, orderPrice, req, res);
  } catch (error) {
    return res.json({ massage: error });
  }
  console.log(orderData);
  // const response = await fetch(
  //   "https://accept.paymob.com/api/ecommerce/orders",
  //   {
  //     method: "POST",
  //     body: JSON.stringify(orderData),
  //   }
  // );

  // const data = await response.json();
  // console.log("response steptwo", await response.json());

  // console.log("data steptwo", data);
  // stepThree(token, data.id, orderPrice, req, res);
};

const stepThree = async (token, id, orderPrice, req, res) => {
  //const { shippingAddress } = req.body;

  const orderData = {
    auth_token: token,
    amount_cents: orderPrice * 100,
    expiration: 3600,
    order_id: id,
    billing_data: {
      apartment: "NA",
      email: req.user.email,
      floor: "NA",
      first_name: req.user.name,
      street: "NA",
      building: "NA",
      phone_number: req.body.shippingAddress.phone,
      shipping_method: "NA",
      postal_code: "NA",
      city: "NA",
      country: "NA",
      last_name: "_",
      state: "NA",
    },
    currency: "EGP",
    integration_id: process.env.PAYMOB_PAYMENT_ID,
    lock_order_when_paid: "false",
  };

  // const { data } = await axios.post(
  //   "https://accept.paymob.com/api/acceptance/payment_keys",
  //   orderData
  // );
  const response = await fetch(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    }
  );
  const data = await response.json();
  console.log("data stepthree", data);
  const ifram = process.env.PAYMOB_IFRAM;
  res.send(
    `https://accept.paymobsolutions.com/api/acceptance/iframes/${ifram}?payment_token=${data.token}`
  );
};
