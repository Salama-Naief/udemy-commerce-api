import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      reqired: true,
      minLength: [3, "category title too short"],
      maxLength: [32, "category title too long"],
      unique: true,
    },
    slug: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

//coman function
const imageURL = (doc) => {
  if (doc.image) {
    doc.image = process.env.BASE_URL + "/" + "categories" + "/" + doc.image;
  }
};

//work in findOne,findAll,update
categorySchema.post("init", function (doc) {
  imageURL(doc);
});

//work in create
categorySchema.post("save", function (doc) {
  imageURL(doc);
});

export default mongoose.model("Category", categorySchema);
