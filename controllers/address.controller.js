import userModel from "../models/user.model.js";

//@desc add address
//@route POST api/addresses
//@access private/auth/user
export const addAddress = async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user.userId,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({ message: "address is added ", data: user.addresses });
};

//@desc remove address
//@route DELETE api/addresses
//@access private/auth/user
export const removeAddress = async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user.userId,
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    { new: true }
  );

  res.status(200).json({
    message: "address is removeded",
    data: user.addresses,
  });
};

//@desc get user addresses
//@route GET api/addresses
//@access private/auth/user
export const getAddresses = async (req, res) => {
  const user = await userModel.findById(req.user.userId).populate("addresses");
  res.status(200).json({
    data: user.addresses,
  });
};
