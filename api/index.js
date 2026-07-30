import dotenv from "dotenv";
dotenv.config();

import app from "../app.js";
import db from "../src/Model/index.js";

let connected = false;

export default async function handler(req, res) {
  if (!connected) {
    try {
      await db.sequelize.authenticate();
      console.log("Database Connected");
      connected = true;
    } catch (err) {
      console.error("DB Connection Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database Connection Failed",
        error: err.message,
      });
    }
  }

  try {
    return app(req, res);
  } catch (err) {
    console.error("Handler Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}
