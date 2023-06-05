import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    content: {
      type: String,
      default: "",
    },
    rate: {
      type: Number,
      min: [1, "min value of rate is 1.0"],
      max: [5, "max value of rate is 5"],
      required: [true, "rate is required!"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "owner of review is reqiured!"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "review must belongs to product!"],
    },
  },
  { timestamps: true }
);

//calculate  avarage rating and number of reviews of specific product
reviewSchema.statics.calcAvgRating = async function (productId) {
  const result = await this.aggregate([
    //stage 1
    { $match: { product: productId } },
    //stage 2
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rate" },
        nomOfReviews: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await this.model("Product").findByIdAndUpdate(productId, {
      rate: result[0].avgRating,
      nomOfReviews: result[0].nomOfReviews,
    });
  } else {
    await this.model("Product").findByIdAndUpdate(productId, {
      rate: 0,
      nomOfReviews: 0,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImg" });
  next();
});

reviewSchema.post("findOneAndDelete", async function (doc, next) {
  await doc.constructor.calcAvgRating(doc.product);
  next();
});

reviewSchema.post("save", async function (doc, next) {
  await doc.populate({ path: "user", select: "name profileImg" });
  await doc.constructor.calcAvgRating(doc.product);
  next();
});

export default mongoose.model("Review", reviewSchema);
