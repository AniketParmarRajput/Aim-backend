import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Routes
import userRoutes from "./src/Routes/userRoute.js";
import userlogin from "./src/Routes/loginRoute.js";
import prizingRoutes from "./src/Routes/prizingRoute.js";

// 🔥 IMPORT DB (models auto-loaded here)
import db from "./src/Model/index.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

(async () => {
  try {
    // ✅ Check DB connection
    await db.sequelize.authenticate();
    console.log("✅ MySQL Connected Successfully");

    // 🔍 Debug: kaun-kaun se models load hue
    console.log(
      "Loaded Models:",
      Object.keys(db.sequelize.models)
    );

    // 🔥 Sync AFTER models loaded
    await db.sequelize.sync();
    console.log("Database synced");

    // Routes
    app.use("/api/employees", userRoutes);
    app.use("/api/login", userlogin);
    app.use("/api/prizing", prizingRoutes);

    // Start server
    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  } catch (err) {
    console.error("DB Error:", err);
  }
})();

