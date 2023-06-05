import express from "express";
import {
  addAddress,
  getAddresses,
  removeAddress,
} from "../controllers/address.controller.js";
import {
  addAddressValidation,
  removeAddressValidation,
} from "../utils/validations/address-validator.js";

import { auth, permissions } from "../middleware/protection.middleware.js";
const router = express.Router();

router.use(auth, permissions("user"));
router.route("/").post(addAddressValidation, addAddress).get(getAddresses);
router.route("/:id").delete(removeAddressValidation, removeAddress);
export default router;
