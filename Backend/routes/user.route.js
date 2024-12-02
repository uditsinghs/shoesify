import express from "express";
import {
  updateAddress,
  login,
  logout,
  resetPassword,
  signup,
  addAddress,
  getUser,
  deleteAddress,
  getAllUser,
  deleteUser,
  updatedUserRole,
} from "../controllers/user.controller.js";
import { isAuthenticated, isAuthorized } from "../middleware/authentication.js";

const router = express.Router();
router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/reset-password", isAuthenticated, resetPassword);
router.post("/add-address", isAuthenticated, addAddress);
router.put("/update-address", isAuthenticated, updateAddress);
router.get("/me", isAuthenticated, getUser);
router.post("/delete-address", isAuthenticated, deleteAddress);
// admin route
router.get(
  "/admin/all-user",
  isAuthenticated,
  isAuthorized("admin"),
  getAllUser
);
router.delete(
  "/admin/user/:userId",
  isAuthenticated,
  isAuthorized("admin"),
  deleteUser
);
router.post(
  "/admin/role/:userId",
  isAuthenticated,
  isAuthorized("admin"),
  updatedUserRole
);

export default router;
