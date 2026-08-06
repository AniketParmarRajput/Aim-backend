import { GoogleGenerativeAI }
from "@google/generative-ai";
 import dotenv from "dotenv";
dotenv.config();
console.log("+++++++++++++++++++++++++++++++++")
console.log(process.env.GEMINI_API_KEY);
console.log("+++++++++++++++++++++++++++++++++")
// Gemini Setup
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const SYSTEM_PROMPT = `You are "Easy Shop Assistant", the friendly AI shopping assistant for Easy Shop, an online fashion store.

Rules:
- Help customers find products, compare items, answer store questions, and guide them through shopping.
- Be concise, friendly and use simple language. Keep answers short and helpful.
- When a product catalog is provided, recommend real products from it using their exact names and prices (in Indian Rupees, format like ₹1,299).
- If a user asks about something not in the catalog, politely say you don't currently stock it.
- If the user wants to buy, tell them to add the item to cart and go to checkout.
- Never invent prices, discounts, or stock levels that are not in the catalog.
- You may mention order status flow: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled.`;

// Chat Controller
export const chatWithGemini = async (req, res) => {

  console.log("📩 Request Hit Controller");

  try {

    const { message, products } = req.body;

    // Validation
    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message is required"
      });

    }

    console.log("User Message:", message);

    // Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    // Build catalog context (compact, token-safe)
    let prompt = message;
    if (Array.isArray(products) && products.length > 0) {
      const catalog = products.map((p, i) =>
        `${i + 1}. ${p.itemName} | category: ${p.category} | price: ₹${p.amount} | discount: ${p.discount ? p.discount + "%" : "none"} | stock: ${p.stock} | badge: ${p.badge || "none"}`
      ).join("\n");
      prompt = `Store catalog:\n${catalog}\n\nCustomer question: ${message}`;
    }

    // Generate AI Response
    const result = await model.generateContent(
      prompt
    );

    const response = result.response.text();

    // Send Response
    res.status(200).json({
      success: true,
      reply: response
    });

  } catch (error) {

    console.log("❌ Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: "Gemini AI Error"
    });

  }

};
