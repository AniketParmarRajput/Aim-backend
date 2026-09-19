import express from "express";
import { checkUser, refreshToken, verifyToken, logout } from "../Controllers/Login.controller.js";
import { loginvalidation } from "../MiddleWare/Valid.js";
const router = express.Router();

router.post('/check', loginvalidation, checkUser);
router.post('/refresh', refreshToken);
router.get('/verify', verifyToken);
router.post('/logout', logout);
export default router;