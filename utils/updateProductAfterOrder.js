import productModel from "../models/product.model.js";

const updateProdutAfterOrder = async (cart) => {
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: {
        $inc: { quantity: -item.quantity, nomOfSales: item.quantity },
      },
    },
  }));
  await productModel.bulkWrite(bulkOption, {});
};

export default updateProdutAfterOrder;
