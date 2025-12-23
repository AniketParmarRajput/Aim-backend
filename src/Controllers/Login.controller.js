import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";

export const checkUser = async (req, res) => {
   try {
      const { email, password } = req.body;
      console.log(req.body)

      if (!process.env.MY_SECRET_KEY) {
         return res.status(500).json({
            message: "Secret key missing",
            token: null
         });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
         // ❗ Token for invalid user
         const errorToken = jwt.sign(
            { invalid: true, reason: "email" },
            process.env.MY_SECRET_KEY,
            { expiresIn: "5d" }
         );
         return res.status(400).json({
            message: "Email not found",
            token: errorToken
         });
      }

      const validPassword = await User.findOne({ where: { password } });
      if (!validPassword) {
         // ❗ Token for invalid password
         const errorToken = jwt.sign(
            { invalid: true, reason: "password" },
            process.env.MY_SECRET_KEY,
            { expiresIn: "5m" }
         );
         return res.status(400).json({
            message: "Password not found",
            token: errorToken
         });
      }

      // ✅ Token for success login
      const token = jwt.sign(
         { id: user.id, email: user.email },
         process.env.MY_SECRET_KEY,
         { expiresIn: "1d" }
      );

      res.status(200).json({
         message: "Login Successfully",
         token,
      });

   } catch (err) {
      console.log(err);

      // ❗ Token for server error
      const errorToken = jwt.sign(
         { invalid: true, reason: "server_error" },
         process.env.MY_SECRET_KEY,
         { expiresIn: "5m" }
      );

      res.status(500).json({
         message: "Server Error",
         token: errorToken
      });
   }
};

export default { checkUser };

