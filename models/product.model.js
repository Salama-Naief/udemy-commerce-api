import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      reqired: true,
      trim: true,
      minLength: [3, "product title too short"],
      maxLength: [200, "product title too long"],
    },
    description: {
      type: String,
      reqired: true,
      minLength: [20, "product description is too short"],
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    slug: { type: String, required: true, lowercase: true },
    nomOfSales: {
      type: Number,
      default: 0,
    },
    nomOfReviews: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
      max: [5, "rate must be less than 5"],
      min: [0, "rate must be grater than 0"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "porduct must be belong to category"],
    },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    coverImage: { type: String, required: true },
    images: [String],
    colors: [String],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "title",
  });
  next();
});

//coman function
const imageURL = (doc) => {
  if (doc.coverImage) {
    doc.coverImage =
      process.env.BASE_URL + "/" + "products" + "/" + doc.coverImage;
  }
  if (doc.images) {
    const images = [];
    doc.images.forEach((img) => {
      images.push(process.env.BASE_URL + "/" + "products" + "/" + img);
    });
    doc.images = images;
  }
};

//work in findOne,findAll,update
productSchema.post("init", function (doc) {
  imageURL(doc);
});

//work in create
// productSchema.post("save", function (doc) {
//   this.populate({
//     path: "category",
//     select: "title",
//   });
//   imageURL(doc);
// });

//populate of reviews
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});
export default mongoose.model("Product", productSchema);
