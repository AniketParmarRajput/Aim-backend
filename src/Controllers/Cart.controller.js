import Cart from "../Model/Cart.model.js";
import Prizing from "../Model/Prizing.model.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "userId and productId are required" });
    }

    const product = await Prizing.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existing = await Cart.findOne({ where: { userId, productId } });
    if (existing) {
      const maxQty = product.stock || 999;
      const newQty = Math.min(Number(existing.quantity) + Number(quantity), maxQty);
      await existing.update({ quantity: newQty });
      return res.status(200).json({ success: true, message: "Cart updated", data: existing });
    }

    const cartItem = await Cart.create({ userId, productId, quantity: Number(quantity) });
    return res.status(201).json({ success: true, message: "Added to cart", data: cartItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.findAll({ where: { userId }, order: [["id", "DESC"]] });

    const productIds = cartItems.map((c) => c.productId);
    const products = productIds.length ? await Prizing.findAll({ where: { id: productIds } }) : [];
    const productMap = {};
    products.forEach((p) => { productMap[p.id] = p; });

    const data = cartItems
      .filter((c) => productMap[c.productId])
      .map((c) => {
        const product = productMap[c.productId];
        return {
          cartId: c.id,
          id: c.productId,
          productId: c.productId,
          userId: c.userId,
          quantity: c.quantity,
          itemName: product.itemName,
          amount: product.amount,
          image: product.image,
          discount: product.discount,
          stock: product.stock,
          sku: product.sku,
          badge: product.badge,
          active: product.active,
        };
      });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    const product = await Prizing.findByPk(cartItem.productId);
    const maxQty = product?.stock || 999;
    cartItem.quantity = Math.max(1, Math.min(Number(quantity), maxQty));
    await cartItem.save();

    return res.status(200).json({ success: true, message: "Cart updated", data: cartItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }
    await cartItem.destroy();
    return res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.destroy({ where: { userId } });
    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { addToCart, getCart, updateCart, removeFromCart, clearCart };
