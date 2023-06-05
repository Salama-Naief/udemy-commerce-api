import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "coupon name is required!"],
      unique: [true, "this name is used before!"],
      trim: true,
    },
    discount: {
      type: Number,
      required: [true, "coupon discount is required!"],
      max: [100, "you cant not apply dicount grater than 100"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product id is required!"],
    },
    expireAt: {
      type: Date,
      required: [true, "expire date is required!"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
