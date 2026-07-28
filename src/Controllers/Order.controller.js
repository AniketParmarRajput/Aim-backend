import Order from "../Model/Order.model.js";
import Prizing from "../Model/Prizing.model.js";

export const createOrder = async (req, res) => {
  try {
    const { email, itemName, sku, price, quantity, paymentMethod, productId, address, mobile, state, district, pincode, image } = req.body;

    if (!email || !itemName || !sku || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (productId) {
      const product = await Prizing.findByPk(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product "${itemName}" not found` });
      }
      const requestedQty = quantity || 1;
      if ((product.stock || 0) < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${itemName}". Available: ${product.stock}, requested: ${requestedQty}`
        });
      }
    }

    const deliveryDate = "7 days";
    const method = paymentMethod === "online" ? "online" : "cash on delivery";
    const status = method === "online" ? "pending" : "confirmed";

    const order = await Order.create({
      email,
      itemName,
      sku,
      price,
      quantity: quantity || 1,
      paymentMethod: method,
      status,
      deliveryDate,
      image: image || null,
      address: address || null,
      mobile: mobile || null,
      state: state || null,
      district: district || null,
      pincode: pincode || null,
    });

    if (productId) {
      const product = await Prizing.findByPk(productId);
      if (product) {
        const newStock = product.stock - (quantity || 1);
        await product.update({ stock: newStock });
      }
    }

    return res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [["id", "DESC"]] });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.findAll({ where: { email }, order: [["id", "DESC"]] });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, deliveryDate, status, address, mobile, state, district, pincode } = req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (quantity !== undefined) {
      const unitPrice = Math.round(Number(order.price) / Number(order.quantity));
      order.quantity = quantity;
      order.price = unitPrice * Number(quantity);
    }
    if (deliveryDate !== undefined) order.deliveryDate = deliveryDate;
    if (status !== undefined) order.status = status;
    if (address !== undefined) order.address = address;
    if (mobile !== undefined) order.mobile = mobile;
    if (state !== undefined) order.state = state;
    if (district !== undefined) order.district = district;
    if (pincode !== undefined) order.pincode = pincode;
    await order.save();

    return res.status(200).json({ success: true, message: "Order updated successfully", data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cannot cancel this order" });
    }

    order.status = "cancelled";
    order.cancelReason = reason || "No reason provided";
    await order.save();

    return res.status(200).json({ success: true, message: "Order cancelled successfully", data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { createOrder, getOrders, getOrdersByEmail, updateOrder, cancelOrder };
