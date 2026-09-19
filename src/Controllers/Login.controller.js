import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";

const SECRET = process.env.MY_SECRET_KEY;

// Helper: issue access token (7h) + refresh token (7d) and store both as HTTP-only cookies
// ALSO sets JS-accessible cookies (non-httpOnly) if you need Cookies.get() on frontend
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

  const isProd = process.env.NODE_ENV === "production";

  // 1. Secure httpOnly cookies — used by Auth middleware (req.cookies.token)
  //    Cannot be accessed via JS -> XSS safe. Sent automatically via credentials: "include"
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: isProd, // true in production (HTTPS) - false for localhost HTTP
    sameSite: "lax",
    maxAge: 7 * 60 * 60 * 1000, // 7 hours
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  // 2. JS-accessible cookies — so frontend can do Cookies.get("access_token")
  //    If you DON'T want JS access, comment out this block (httpOnly=true is more secure)
  res.cookie("access_token", accessToken, {
    httpOnly: false, // <- accessible via document.cookie / js-cookie
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return { accessToken, refreshToken };
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

       // ✅ Access token (7h) + refresh token (7d) stored as cookies (httpOnly + JS-accessible)
       const { accessToken, refreshToken: newRefreshToken } = setTokens(res, user);

       res.status(200).json({
          message: "Login Successfully",
          token: accessToken, // keep backward compat
          accessToken,
          refreshToken: newRefreshToken,
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
      const refreshToken = req.cookies?.refreshToken || req.cookies?.refresh_token || req.body?.refreshToken;

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
       const { accessToken, refreshToken: newRefreshToken } = setTokens(res, user);

       return res.status(200).json({
          message: "Token refreshed successfully",
          token: accessToken, // keep backward compat
          accessToken,
          refreshToken: newRefreshToken,
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

// Verify access token validity (for flow: Application starts -> Is access token valid?)
// Uses same logic as Auth middleware but returns 200 if valid
export const verifyToken = (req, res) => {
   const token = req.cookies?.token || req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
   if (!token) {
      return res.status(401).json({ valid: false, message: "Access token missing" });
   }
   try {
      const decoded = jwt.verify(token, SECRET);
      return res.status(200).json({ valid: true, message: "Access token valid", user: decoded });
   } catch (err) {
      return res.status(401).json({ valid: false, message: "Invalid or expired access token" });
   }
};

// Logout: clear both tokens from cookies (httpOnly + JS-accessible)
export const logout = (req, res) => {
   const opts = { httpOnly: true, secure: false, sameSite: "lax", path: "/" };
   const optsJs = { httpOnly: false, secure: false, sameSite: "lax", path: "/" };
   // clear httpOnly
   res.clearCookie("token", opts);
   res.clearCookie("refreshToken", opts);
   // clear JS-accessible
   res.clearCookie("access_token", optsJs);
   res.clearCookie("refresh_token", optsJs);
   // also clear in production mode (secure:true) - ensure both variants cleared
   res.clearCookie("token", { ...opts, secure: true });
   res.clearCookie("refreshToken", { ...opts, secure: true });
   res.clearCookie("access_token", { ...optsJs, secure: true });
   res.clearCookie("refresh_token", { ...optsJs, secure: true });
   res.status(200).json({ message: "Logged out successfully" });
};

export default { checkUser, refreshToken, verifyToken, logout };