import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./src/Routes/userRoute.js";
import userlogin from "./src/Routes/loginRoute.js";
import prizingRoutes from "./src/Routes/prizingRoute.js";
import ContactRouter from "./src/Routes/contactRoute.js";
import paypalRoutes from "./src/Routes/paypalRoute.js";
import orderRoutes from "./src/Routes/orderRoute.js";

const app = express();

const allowedOrigins = [
  "https://aim-alpha-hazel.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/employees", userRoutes);
app.use("/api/login", userlogin);
app.use("/api/prizing", prizingRoutes);
app.use("/api/contact", ContactRouter);
app.use("/api/paypal", paypalRoutes);
app.use("/api/order", orderRoutes);

export default app;
