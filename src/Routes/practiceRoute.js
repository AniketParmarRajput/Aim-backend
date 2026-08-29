import express from "express";
import {
  addPractice,
  getPractices,
  getPracticeById,
  updatePractice,
  deletePractice,
  getDailyPractices,
  submitPractice,
  getMySubmissions,
  getAllSubmissions,
  resetPractice,
} from "../Controllers/Practice.controller.js";
import { practicalUpload } from "../MiddleWare/upload.js";

const router = express.Router();

const mediaFields = [
  { name: "questionImage", maxCount: 1 },
  { name: "questionPdf", maxCount: 1 },
  { name: "questionVideo", maxCount: 1 },
  { name: "solutionImage", maxCount: 1 },
  { name: "solutionPdf", maxCount: 1 },
  { name: "solutionVideo", maxCount: 1 },
];

// Practice CRUD - single table PraticalQuestion with pdf/image/video for question & solution
router.post("/add", practicalUpload.fields(mediaFields), addPractice);
router.get("/all", getPractices);
router.get("/daily", getDailyPractices);
router.get("/submissions/my", getMySubmissions);
router.get("/submissions/all", getAllSubmissions);
router.post("/submit", practicalUpload.fields([{ name: "solutionImage", maxCount: 1 }, { name: "solutionPdf", maxCount: 1 }, { name: "solutionVideo", maxCount: 1 }]), submitPractice);
router.patch("/:id/reset", resetPractice);
router.get("/:id", getPracticeById);
router.put("/:id", practicalUpload.fields(mediaFields), updatePractice);
router.delete("/:id", deletePractice);

export default router;
