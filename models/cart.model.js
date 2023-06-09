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
      size: { type: String, default: "" },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, default: 0 },
  totalPriceAfterDisc: { type: Number, default: 0 },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "title rate coverImage imageCover description",
  });
  next();
});

export default mongoose.model("Cart", cartSchema);
