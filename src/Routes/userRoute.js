import express from "express";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
  getByEmail,
  getByEmployeeID,
  updatePassword
} from "../Controllers/User.controller.js";
import {signupValidation} from "../MiddleWare/Valid.js"


const router = express.Router();

router.post("/",signupValidation, createEmployee);
router.get("/get", getEmployees);
router.delete("/delete/:id", deleteEmployee);
router.get("/get-by-email/:email", getByEmail);
router.get("/get/:id", getByEmployeeID)
router.post("/update-password", updatePassword);
export default router;
