import express from 'express';
 import { addPrizing } from '../Controllers/Prizing.controller.js';
 import { upload } from '../MiddleWare/upload.js';
 
const router = express.Router();

router.post('/addPrizing', upload.single('image'), addPrizing);
export default router;