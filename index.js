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
import paypalRoutes from "./src/Routes/paypalRoute.js";
import orderRoutes from "./src/Routes/orderRoute.js";



// 🔥 IMPORT DB (models auto-loaded here)
import db from "./src/Model/index.js";

const app = express();
const allowedOrigins = [
  "https://aim-alpha-hazel.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/employees", userRoutes);
app.use("/api/login", userlogin);
app.use("/api/prizing", prizingRoutes);
app.use("/api/contact", ContactRouter);
app.use("/api/paypal", paypalRoutes);
app.use("/api/order", orderRoutes);

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ MySQL Connected Successfully");
    console.log("Loaded Models:", Object.keys(db.sequelize.models));
    await db.sequelize.sync({ alter: true });
    console.log("Database synced");
  } catch (err) {
    console.error("DB Error:", err);
  }

  app.listen(5000, () => console.log("Server running on port 5000"));
})();

