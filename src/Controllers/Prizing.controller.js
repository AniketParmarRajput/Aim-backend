import { v2 as cloudinary } from "cloudinary";
import Prizing from "../Model/Prizing.model.js";

cloudinary.config({
  cloud_name: "dviokng6d",
  api_key: "187969885516314",
  api_secret: "qGctzEPVAxK9UDeiqQqJIEUfhwk",
});

const generateSku = async (itemName, category) => {
    const first = (itemName || "X").charAt(0).toUpperCase();
    const second = (category || "X").charAt(0).toUpperCase();
    const prefix = first + second;
    const count = await Prizing.count();
    const num = String(count + 1).padStart(3, "0");
    return prefix + num;
};

export const addPrizing = async (req, res) => {
    try {
        const { itemName, amount, description, category, discount, badge, colour, stock, sku: bodySku, active: bodyActive, imageUrl } = req.body;

        let image = null;
        if (req.file) {
          const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
          const result = await cloudinary.uploader.upload(b64, {
            folder: "prizing",
          });
          image = result.secure_url;
          console.log("Cloudinary URL:", image);
        } else if (imageUrl) {
          image = imageUrl;
        }

        if (!itemName || !amount || !description || !image) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const sku = bodySku || (await generateSku(itemName, category));
        const active = bodyActive !== undefined ? bodyActive === true || bodyActive === "true" : true;

        const createPrizing = await Prizing.create({
            itemName,
            amount,
            description,
            image,
            category,
            discount,
            badge,
            colour,
            stock,
            sku,
            active
        });

        return res.status(201).json({
            success: true,
            message: "Prizing added successfully",
            data: createPrizing
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getPrizing = async(req,res) =>{
    try{
        const prizing = await Prizing.findAll();
        console.log(prizing);
        res.status(200).json({success:"true", message:"done", data:prizing})
    }
    catch(err){
        res.status(500).json({success:"false", message:"internal error"})
    }
}

 export const getPrizingById = async(req,res) =>{
    try{
        const {id} = req.params;
        const prizing = await Prizing.findByPk(id);
        if(!prizing){
            return res.status(404).json({success:"false", message:"prizing not found"})
        }
        res.status(200).json({success:"true", message:"done", data:prizing})
    }
    catch(err){
        res.status(500).json({success:"false", message:"internal error"})
    }
}

export const updatePrizing = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, amount, description, category, discount, badge, colour, stock, active, imageUrl } = req.body;
        let image = undefined;
        if (req.file) {
          const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
          const result = await cloudinary.uploader.upload(b64, {
            folder: "prizing",
          });
          image = result.secure_url;
          console.log("Cloudinary URL:", image);
        } else if (imageUrl) {
          image = imageUrl;
        }

        const product = await Prizing.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const updateData = {};
        if (itemName) updateData.itemName = itemName;
        if (amount) updateData.amount = amount;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (discount) updateData.discount = discount;
        if (badge) updateData.badge = badge;
        if (colour) updateData.colour = colour;
        if (stock !== undefined) updateData.stock = stock;
        if (active !== undefined) updateData.active = active === true || active === "true";
        if (image) updateData.image = image;

        await product.update(updateData);

        return res.status(200).json({ success: true, message: "Product updated successfully", data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePrizing = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Prizing.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        await product.destroy();
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Prizing.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const updated = await product.update({ active: !product.active });
        return res.status(200).json({ success: true, message: "Status updated", data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default { addPrizing, getPrizing, getPrizingById, updatePrizing, deletePrizing, toggleActive };
