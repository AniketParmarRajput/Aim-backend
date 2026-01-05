import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// Routes
import userRoutes from "./src/Routes/userRoute.js";
import userlogin from "./src/Routes/loginRoute.js";
import prizingRoutes from "./src/Routes/prizingRoute.js";
import ContactRouter from "./src/Routes/contactRoute.js";
import isverify from "./src/MiddleWare/Auth.js";


// 🔥 IMPORT DB (models auto-loaded here)
import db from "./src/Model/index.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/employees",userRoutes);
app.use("/api/login", userlogin);
app.use("/api/prizing", prizingRoutes);
app.use("/api/contact", ContactRouter);

//start Server
app.listen(5000, () => console.log("Server running on port 5000"));

(async () => {
  try {
    // ✅ Check DB connection
    await db.sequelize.authenticate();
    console.log("✅ MySQL Connected Successfully");

    // 🔍 Debug: kaun-kaun se models load hue
    console.log("Loaded Models:", Object.keys(db.sequelize.models));

    // 🔥 Sync AFTER models loaded
    await db.sequelize.sync({ alter: true });
    console.log("Database synced");
  } catch (err) {
    console.error("DB Error:", err);
  }
})();
