import express from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  resizeImage,
  updateUser,
  uploadImage,
  changeRole,
} from "../controllers/user.controller.js";
import {
  changePasswordValidation,
  createUserValidation,
  deleteUserValidation,
  getUserValidation,
  updateUserValidation,
  changeRoleValidation,
} from "../utils/validations/user-validator.js";

import {
  auth,
  permissions,
  userAdminPermissions,
} from "../middleware/protection.middleware.js";
const router = express.Router();
router.use(auth);
router.route("/changepassword").patch(changePasswordValidation, changePassword);

router
  .route("/changerole/:id")
  .patch(permissions("admin"), changeRoleValidation, changeRole);
router
  .route("/")
  .post(
    permissions("admin"),
    uploadImage,
    resizeImage,
    createUserValidation,
    createUser
  )
  .get(permissions("admin"), getUsers);
router
  .route("/:id")
  .get(
    userAdminPermissions("admin"),
    permissions("admin"),
    getUserValidation,
    getUser
  )
  .patch(
    userAdminPermissions("admin"),
    uploadImage,
    resizeImage,
    updateUserValidation,
    updateUser
  )
  .delete(permissions("admin"), deleteUserValidation, deleteUser);
export default router;
