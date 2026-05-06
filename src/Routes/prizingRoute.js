import express from 'express';
 import { addPrizing, getPrizing } from '../Controllers/Prizing.controller.js';
 import { upload } from '../MiddleWare/upload.js';
 
const router = express.Router();

router.post('/addPrizing', upload.single('image'), addPrizing);
router.get('/getPrizing', getPrizing);
export default router;