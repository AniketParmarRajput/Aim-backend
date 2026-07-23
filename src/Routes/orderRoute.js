import express from "express";
import { createOrder, getOrders, getOrdersByEmail, updateOrder, cancelOrder } from "../Controllers/Order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/all", getOrders);
router.get("/by-email/:email", getOrdersByEmail);
router.put("/update/:id", updateOrder);
router.put("/cancel/:id", cancelOrder);

export default router;
