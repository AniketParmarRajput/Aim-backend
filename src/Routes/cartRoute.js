import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../Controllers/Cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/user/:userId", getCart);
router.put("/update/:id", updateCart);
router.delete("/remove/:id", removeFromCart);
router.delete("/clear/:userId", clearCart);

export default router;
