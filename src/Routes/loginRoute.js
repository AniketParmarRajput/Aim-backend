import express from "express";
import { checkUser, refreshToken, verifyToken, logout } from "../Controllers/Login.controller.js";
import { loginvalidation } from "../MiddleWare/Valid.js";
import ApiLimited from "../MiddleWare/ApiLimited.js";

const router = express.Router();

router.post('/check', ApiLimited, loginvalidation, checkUser);
router.post('/refresh', refreshToken);
router.get('/verify', verifyToken);
router.post('/logout', logout);
export default router;