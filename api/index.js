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
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Database Connection Failed",
        error: err.message,
      });
    }
  }

  return app(req, res);
}
