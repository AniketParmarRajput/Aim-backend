import express from "express";
import { checkUser } from "../Controllers/Login.controller.js";
import { loginvalidation } from "../MiddleWare/Valid.js";
const router = express.Router();

router.post('/check', loginvalidation, checkUser);
export default router;