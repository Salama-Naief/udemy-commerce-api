import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema(
  {
    title: {
      type: String,
      minLength: [2, "subcategory title is too short"],
      maxLength: [32, "subcategory title is too long"],
      required: [true, "subcategory title is required"],
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
