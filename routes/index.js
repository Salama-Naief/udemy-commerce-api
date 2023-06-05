import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import brandRoute from "./brand.route.js";
import categoryRoute from "./category.route.js";
import subcategoryRoute from "./subcategory.route.js";
import productRoute from "./product.route.js";
import reviewRoute from "./review.route.js";
import wishlistRoute from "./wishlist.route.js";
import addressRoute from "./address.route.js";
import couponRoute from "./coupon.route.js";
import cartRoute from "./cart.route.js";
import orderRoute from "./order.route.js";

export const MoundedRoute = (app) => {
  app.use("/api/category", categoryRoute);
  app.use("/api/subcategories", subcategoryRoute);
  app.use("/api/brands", brandRoute);
  app.use("/api/products", productRoute);
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/reviews", reviewRoute);
  app.use("/api/wishlists", wishlistRoute);
  app.use("/api/addresses", addressRoute);
  app.use("/api/coupons", couponRoute);
  app.use("/api/cart", cartRoute);
  app.use("/api/order", orderRoute);
};
export default MoundedRoute;
