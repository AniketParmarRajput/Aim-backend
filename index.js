import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./src/Model/index.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database Connected");
    await db.sequelize.sync();
    app.listen(PORT, () => {
      console.log(`🚀 Server Running on ${PORT}`);
    });
  } catch (err) {
    console.error("Database Error:", err);
  }
})();
