import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
      minLenght: 3,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowerCase: true,
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      default: "",
    },
    profileImg: {
      type: String,
      default: "",
    },
    wishList: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        id: Schema.Types.ObjectId,
        alias: String,
        details: String,
        city: String,
        postalCode: Number,
        phone: String,
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user", "manager"],
      default: "user",
    },
  },

  { timestamps: true, discriminatorKey: "kind" }
);

//coman function
const imageURL = (doc) => {
  //doc.password = "";
  if (doc.profileImg && !doc.profileImg.startsWith("http")) {
    doc.profileImg =
      process.env.BASE_URL + "/" + "users" + "/" + doc.profileImg;
  }
};

//work in findOne,findAll,update
userSchema.post("init", function (doc) {
  imageURL(doc);
});

//work in create
userSchema.post("save", function (doc) {
  imageURL(doc);
});
export default mongoose.model("User", userSchema);
