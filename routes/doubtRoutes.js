// routes/doubtRoutes.js
import express from 'express';
import { submitDoubt, getDoubts, updateDoubt, deleteDoubt, getAllDoubts } from '../controllers/doubtContrller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Submit a new doubt
router.post('/doubts/submit', upload.single('file'), submitDoubt);

// Get all doubts for a student
router.get('/student-doubt/:studentId', getDoubts);
router.get('/all-doubt', getAllDoubts);

// Update doubt status and mentor response
router.put('/update-doubt/:id', upload.single('file'),updateDoubt);

// Delete a doubt
router.delete('/delete-doubt/:id', deleteDoubt);

export default router;