import Wishlist from "../Model/Wishlist.model.js";
import Prizing from "../Model/Prizing.model.js";

export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "userId and productId are required" });
    }

    const product = await Prizing.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) {
      return res.status(200).json({ success: true, message: "Already in wishlist", data: existing });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    return res.status(201).json({ success: true, message: "Added to wishlist", data: wishlistItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlistItems = await Wishlist.findAll({ where: { userId }, order: [["id", "DESC"]] });

    const productIds = wishlistItems.map((w) => w.productId);
    const products = productIds.length ? await Prizing.findAll({ where: { id: productIds } }) : [];
    const productMap = {};
    products.forEach((p) => { productMap[p.id] = p; });

    const data = wishlistItems
      .filter((w) => productMap[w.productId])
      .map((w) => {
        const product = productMap[w.productId];
        return {
          wishlistId: w.id,
          id: w.productId,
          productId: w.productId,
          userId: w.userId,
          itemName: product.itemName,
          amount: product.amount,
          description: product.description,
          image: product.image,
          category: product.category,
          discount: product.discount,
          stock: product.stock,
          badge: product.badge,
          active: product.active,
        };
      });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const wishlistItem = await Wishlist.findByPk(id);
    if (!wishlistItem) {
      return res.status(404).json({ success: false, message: "Wishlist item not found" });
    }
    await wishlistItem.destroy();
    return res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeWishlistByProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Wishlist.destroy({ where: { userId, productId } });
    return res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    await Wishlist.destroy({ where: { userId } });
    return res.status(200).json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { addToWishlist, getWishlist, removeFromWishlist, removeWishlistByProduct, clearWishlist };
