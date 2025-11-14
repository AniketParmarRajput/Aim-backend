import express from "express";
import {
  createEmployee,
  getEmployees,
} from "../Controllers/User.controller.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getEmployees);
export default router;
