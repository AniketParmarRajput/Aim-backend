import { GoogleGenerativeAI }
from "@google/generative-ai";

console.log("✅ Gemini Controller Loaded");

// Gemini Setup
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Chat Controller
export const chatWithGemini = async (req, res) => {

  console.log("📩 Request Hit Controller");

  try {

    const { message } = req.body;

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
      model: "gemini-2.0-flash"
    });

    // Generate AI Response
    const result = await model.generateContent(
      message
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