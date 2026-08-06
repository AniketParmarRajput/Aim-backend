import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  removeWishlistByProduct,
  clearWishlist,
} from "../Controllers/Wishlist.controller.js";

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/user/:userId", getWishlist);
router.delete("/remove/:id", removeFromWishlist);
router.delete("/remove-product/:userId/:productId", removeWishlistByProduct);
router.delete("/clear/:userId", clearWishlist);

export default router;