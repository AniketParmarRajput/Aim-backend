import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Routes
import userRoutes from "./src/Routes/userRoute.js";
import userlogin from "./src/Routes/loginRoute.js";
import prizingRoutes from "./src/Routes/prizingRoute.js";
import ContactRouter from "./src/Routes/contactRoute.js";

// DB (Sequelize instance + models)
import db from "./src/Model/index.js";

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/employees", userRoutes);
app.use("/api/login", userlogin);
app.use("/api/prizing", prizingRoutes);
app.use("/api/contact", ContactRouter);

// ✅ Database + Server bootstrap
const startServer = async () => {
  try {
    // 1️⃣ DB connection test
    await db.sequelize.authenticate();
    console.log("✅ TiDB / MySQL Connected Successfully");

    // 2️⃣ Debug: Loaded models
    console.log("📦 Loaded Models:", Object.keys(db.sequelize.models));

    // 3️⃣ Sync models
    await db.sequelize.sync({ alter: true });
    console.log("✅ Database synced");

    // 4️⃣ Start server AFTER DB ready
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );

  } catch (err) {
    console.error("❌ DB Error:", err);
    process.exit(1); // app band ho jaaye agar DB fail
  }
};

startServer();
