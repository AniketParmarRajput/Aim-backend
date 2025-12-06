import express from "express";
import {
  getEmployees,
  createEmployee
} from "../Controllers/User.controller.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/get", getEmployees);
export default router;
