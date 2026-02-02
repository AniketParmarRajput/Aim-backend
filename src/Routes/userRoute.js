import express from "express";
import {
  getEmployees,
  createEmployee,
  deleteEmployee
} from "../Controllers/User.controller.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/get", getEmployees);
router.delete("/delete/:id", deleteEmployee);
export default router;
