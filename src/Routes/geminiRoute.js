import express from "express";

console.log("✅ Gemini Route File Loaded");

import {
  chatWithGemini
} from "../Controllers/Gemini.controller.js";

console.log(
  "chatWithGemini =",
  chatWithGemini
);

const router = express.Router();

router.post(
  "/chat",
  chatWithGemini
);

export default router;