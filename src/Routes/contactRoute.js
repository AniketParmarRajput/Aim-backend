import express from 'express'
import { CreateContact } from '../Controllers/Contact.controller.js'
const router = express.Router();
router.post("/create",CreateContact)
export default router;