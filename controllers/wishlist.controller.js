import userModel from "../models/user.model.js";

//@desc add wishlist
//@route POST api/wishlists
//@access private/auth/user
export const addToWishList = async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user.userId,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "product add to your wishlist", data: user.wishList });
};

//@desc remove wishlist
//@route DELETE api/wishlists
//@access private/auth/user
export const removeFromWishList = async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user.userId,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    message: "product removed from your wishlist",
    data: user.wishList,
  });
};

//@desc get user wishlist
//@route GET api/wishlists
//@access private/auth/user
export const getWishList = async (req, res) => {
  const user = await userModel
    .findById(req.user.userId)
    .populate({
      path: "wishList",
      select: "title price imageCover rate nomOfReviews",
    });
  res.status(200).json({
    data: user.wishList,
  });
};
