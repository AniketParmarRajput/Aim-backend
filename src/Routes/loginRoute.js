import express from "express";
import { checkUser } from "../Controllers/Login.controller.js";
const router = express.Router();

router.post('/check',checkUser);
export default router;