// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";

// // Routes
// import userRoutes from "./src/Routes/userRoute.js";
// import userlogin from "./src/Routes/loginRoute.js";
// import prizingRoutes from "./src/Routes/prizingRoute.js";
// import ContactRouter from "./src/Routes/contactRoute.js";

// // 🔥 IMPORT DB (models auto-loaded here)
// import db from "./src/Model/index.js";

// const app = express();
// // app.use(cors({ origin: "*" }));
// app.use(cors({ origin: true }));

// app.use(express.json());

// // Routes
// app.use("/api/employees", userRoutes);
// app.use("/api/login", userlogin);
// app.use("/api/prizing", prizingRoutes);
// app.use("/api/contact", ContactRouter);

// //start Server
// app.listen(5000, () => console.log("Server running on port 5000"));

// (async () => {
//   try {
//     // ✅ Check DB connection
//     await db.sequelize.authenticate();
//     console.log("✅ MySQL Connected Successfully");

//     // 🔍 Debug: kaun-kaun se models load hue
//     console.log("Loaded Models:", Object.keys(db.sequelize.models));

//     // 🔥 Sync AFTER models loaded
//     await db.sequelize.sync({ alter: true });
//     console.log("Database synced");
//   } catch (err) {
//     console.error("DB Error:", err);
//   }
// })();
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
app.use(cors({ origin: true }));
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

// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";

// // 🔹 Load correct env file
// const envFile =
//   process.env.NODE_ENV === "development"
//     ? ".env.dev"
//     : ".env.prod";

// dotenv.config({ path: envFile });

// // Routes
// import userRoutes from "./src/Routes/userRoute.js";
// import userlogin from "./src/Routes/loginRoute.js";
// import prizingRoutes from "./src/Routes/prizingRoute.js";
// import ContactRouter from "./src/Routes/contactRoute.js";

// // DB (Sequelize instance + models)
// import db from "./src/Model/index.js";

// const app = express();

// // Middlewares
// app.use(cors({ origin: true }));
// app.use(express.json());

// // Routes
// app.use("/api/employees", userRoutes);
// app.use("/api/login", userlogin);
// app.use("/api/prizing", prizingRoutes);
// app.use("/api/contact", ContactRouter);

// // ✅ Database + Server bootstrap
// const startServer = async () => {
//   try {
//     // 1️⃣ DB connection test
//     await db.sequelize.authenticate();
//     console.log("✅ Database Connected Successfully");

//     // 2️⃣ Debug: Loaded models
//     console.log("📦 Loaded Models:", Object.keys(db.sequelize.models));

//     // 3️⃣ Sync models
//     await db.sequelize.sync({ alter: true });
//     console.log("✅ Database synced");

//     // 4️⃣ Start server AFTER DB ready
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () =>
//       console.log(
//         `🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`
//       )
//     );
//   } catch (err) {
//     console.error("❌ DB Error:", err);
//     process.exit(1);
//   }
// };

// startServer();
