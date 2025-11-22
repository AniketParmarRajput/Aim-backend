import express from "express";
import userRoutes from "./src/Routes/userRoute.js";
import userlogin from './src/Routes/loginRoute.js'
import sequelize from "./Config/db.js";  // ✅ CORRECT
import cors from "cors";


const app = express();
app.use(cors({origin:"*"}));

// Middleware
app.use(express.json());
// Sync the database and tables
// sequelize
//   .sync({ alter: true })
//   .then(() => console.log("Database synced"))
//   .catch((err) => console.error("Error syncing database:", err));

// Routes
app.use("/api/employees", userRoutes);
app.use("/api/login", userlogin);


// Database Connection
// sequelize.sync().then(() => {
//   console.log("Database connected");
// });

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
