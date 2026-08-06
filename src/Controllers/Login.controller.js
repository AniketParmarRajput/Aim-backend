import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";

const SECRET = process.env.MY_SECRET_KEY;

// Helper: issue access token (7h) + refresh token (7d) and store both as HTTP-only cookies
const setTokens = (res, user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "7h" } // access token valid for 7 hours
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, type: "refresh" },
    SECRET,
    { expiresIn: "7d" } // refresh token valid for 7 days
  );

  // Access token cookie — expires in 7 hours
  res.cookie("token", accessToken, {
    httpOnly: true,     // cannot be accessed via JS (secure)
    secure: false,      // true in production (HTTPS)
    sameSite: "lax",
    maxAge: 7 * 60 * 60 * 1000, // 7 hours
  });

  // Refresh token cookie — expires in 7 days
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};

export const checkUser = async (req, res) => {
   try {
      const { email, password } = req.body;
      console.log(req.body)

      if (!SECRET) {
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
            SECRET,
            { expiresIn: "5d" }
         );
         return res.status(400).json({
            message: "Email not found",
            token: errorToken
         });
      }

      if (user.password !== password) {
         // ❗ Token for invalid password
         const errorToken = jwt.sign(
            { invalid: true, reason: "password" },
            SECRET,
            { expiresIn: "5d" }
         );
         return res.status(400).json({
            message: "Password not found",
            token: errorToken
         });
      }

      // ✅ Access token (7h) + refresh token (7d) stored as cookies
      const token = setTokens(res, user);

      res.status(200).json({
         message: "Login Successfully",
         token,
          user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
   }
      });

   } catch (err) {
      console.log(err);

      // ❗ Token for server error
      const errorToken = jwt.sign(
         { invalid: true, reason: "server_error" },
         SECRET,
         { expiresIn: "5m" }
      );

      res.status(500).json({
         message: "Server Error",
         token: errorToken
      });
   }
};

// Refresh the access token using the refresh token (valid 7 days)
export const refreshToken = async (req, res) => {
   try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
         return res.status(401).json({
            message: "Unauthorized: Refresh token missing",
         });
      }

      let decoded;
      try {
         decoded = jwt.verify(refreshToken, SECRET);
      } catch (err) {
         return res.status(401).json({
            message: "Unauthorized: Invalid or expired refresh token",
         });
      }

      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user) {
         return res.status(401).json({
            message: "Unauthorized: User not found",
         });
      }

      // Issue a fresh access token + refresh token (renews to full 7 days)
      const token = setTokens(res, user);

      return res.status(200).json({
         message: "Token refreshed successfully",
         token,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
         },
      });
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         message: "Server Error",
      });
   }
};

// Logout: clear both tokens from cookies
export const logout = (req, res) => {
   res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
   res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "lax" });
   res.status(200).json({ message: "Logged out successfully" });
};

export default { checkUser, refreshToken, logout };