import express from 'express';
 import { addPrizing, getPrizing, getPrizingById, updatePrizing, deletePrizing, toggleActive } from '../Controllers/Prizing.controller.js';
 import { upload } from '../MiddleWare/upload.js';
 
const router = express.Router();

router.post('/addPrizing', upload.single('image'), addPrizing);
router.get('/getPrizing', getPrizing);
router.get('/getPrizing/:id', getPrizingById);
router.put('/updatePrizing/:id', upload.single('image'), updatePrizing);
router.delete('/deletePrizing/:id', deletePrizing);
router.patch('/toggleActive/:id', toggleActive);
export default router;