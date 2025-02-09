import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,

} from "../controllers/category.controller.js";
import { isAuthenticated, isAuthorized } from "../middleware/authentication.js";
const router = express.Router();

router.post(  
  "/admin/create",
  isAuthenticated,
  isAuthorized("admin"),
  createCategory
);
router.get(
  "/admin/getall",
  isAuthenticated,
  getAllCategories
);

router.delete(
  "/admin/delete/:cid",
  isAuthenticated,
  isAuthorized("admin"),
  deleteCategory
);
router.put(
  "/admin/edit/:cid",
  isAuthenticated,
  isAuthorized("admin"),
updateCategory
);
export default router;
