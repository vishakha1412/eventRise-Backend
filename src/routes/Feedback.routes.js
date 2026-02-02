import express from 'express';
import { submitFeedback } from '../controllers/Feedback.controller.js';
import { getAllFeedback } from '../controllers/Feedback.controller.js';
 import { deleleteFeedback } from '../controllers/Feedback.controller.js';
 

const router = express.Router();

router.post('/submit', submitFeedback);
router.get('/all', getAllFeedback);
router.delete('/delete/:id',deleleteFeedback)
 
 

export default router;
 