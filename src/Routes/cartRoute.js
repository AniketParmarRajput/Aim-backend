import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../Controllers/AddToCart.controller.js";
import { isAuthenticated } from "../MiddleWare/Auth.js";
const router = express.Router();

router.post("/add",isAuthenticated, addToCart);
router.get("/user/:userId",isAuthenticated, getCart);
router.put("/update/:id",isAuthenticated, updateCart);
router.delete("/remove/:id",isAuthenticated, removeFromCart);
router.delete("/clear/:userId",isAuthenticated, clearCart);

export default router;
