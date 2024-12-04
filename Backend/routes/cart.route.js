import express from "express";
import { isAuthenticated } from "../middleware/authentication.js";
import {
  addToCart,
  clearCart,
  deleteFromCart,
  getAllCartProduct,
  getCart,
  updateCart,
} from "../controllers/cart.controller.js";
const router = express.Router();
router.post("/add", isAuthenticated, addToCart);
router.get("/get/:userId", getAllCartProduct);
router.delete("/delete", isAuthenticated, deleteFromCart);
router.post("/clear", isAuthenticated, clearCart);
router.put("/update", isAuthenticated, updateCart);
router.get('/get-cart',isAuthenticated,getCart)

export default router;
