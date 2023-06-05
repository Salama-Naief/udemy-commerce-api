import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "brand title too short"],
      maxLength: [32, "brand title too long"],
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
    doc.image = process.env.BASE_URL + "/" + "brands" + "/" + doc.image;
  }
};

//work in findOne,findAll,update
brandSchema.post("init", function (doc) {
  imageURL(doc);
});

//work in create
brandSchema.post("save", function (doc) {
  imageURL(doc);
});

export default mongoose.model("Brand", brandSchema);
