import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedback.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, submitFeedback);
router.get('/all', authenticate, authorize('admin'), getAllFeedback);

export default router;
