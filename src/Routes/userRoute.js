import express from "express";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
  getByEmployeeID
} from "../Controllers/User.controller.js";
import {signupValidation} from "../MiddleWare/Valid.js"


const router = express.Router();

router.post("/",signupValidation, createEmployee);
router.get("/get", getEmployees);
router.delete("/delete/:id", deleteEmployee);
router.get("/get/:id", getByEmployeeID)
export default router;
