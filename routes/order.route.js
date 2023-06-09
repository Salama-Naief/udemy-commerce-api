import express from "express";
import {
  createCashOrder,
  getOrders,
  filterObj,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelevered,
} from "../controllers/order.controller.js";
// import {
//   createBrandValidation,
//   deleteBrandValidation,
//   getBrandValidation,
//   updateBrandValidation,
// } from "../utils/validations/brand-validator.js";

import { auth, permissions } from "../middleware/protection.middleware.js";
import { payWithStripe } from "../paymentsProdviders/stripe.js";
import { payWithPaymob } from "../paymentsProdviders/paymob.js";
import { PayWithPaytabs } from "../paymentsProdviders/paytabs.js";
const router = express.Router();

router.use(auth);
router.post("/cash", permissions("user"), createCashOrder);
router.get("/", permissions("user", "admin", "manager"), filterObj, getOrders);
router.patch("/topaid/:id", permissions("admin", "manager"), updateOrderToPaid);
router.patch(
  "/todelevered/:id",
  permissions("admin", "manager"),
  updateOrderToDelevered
);
//stripe checkout session
router.post("/checkoutsession/:cartId", permissions("user"), payWithStripe);
router.post("/paymobcheckout/", permissions("user"), payWithPaymob);
router.post("/paytabscheckout/", permissions("user"), PayWithPaytabs);
router.get(
  "/:id",
  permissions("user", "admin", "manager"),
  filterObj,
  getOrder
);
// router
//   .route("/:id")
//   .get(getBrandValidation, getBrand)
//   .patch(
//     auth,
//     permissions("admin", "manager"),
//     uploadImage,
//     resizeImage,
//     updateBrandValidation,
//     updateBrand
//   )
//   .delete(auth, permissions("admin"), deleteBrandValidation, deleteBrand);
export default router;
