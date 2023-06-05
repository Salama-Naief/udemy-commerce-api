import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  cartItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      color: { type: String, default: "" },
      quantity: { type: Number },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  paymentMenthod: { type: String, enum: ["cash", "card"], default: "cash" },
  isDelevered: { type: Boolean, default: false },
  deleveredAt: Date,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  taxPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  orderPrice: { type: Number, default: 0 },
  shippingAddress: {
    details: String,
    phone: String,
    city: String,
    postalCode: String,
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "title coverImage",
  }).populate({
    path: "user",
    select: "name email phone profileImg",
  });
  next();
});

cartSchema.post("save", async function () {
  await this.populate({
    path: "cartItems.product",
    select: "title coverImage",
  });
  this.populate({
    path: "user",
    select: "name email phone profileImg",
  });
});

export default mongoose.model("Order", cartSchema);
