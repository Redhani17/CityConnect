import express from 'express';
import {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
} from '../controllers/job.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (authenticated users)
router.get('/', authenticate, getAllJobs);
router.get('/:id', authenticate, getJob);

// Admin routes
router.post('/', authenticate, authorize('admin'), createJob);
router.put('/:id', authenticate, authorize('admin'), updateJob);
router.delete('/:id', authenticate, authorize('admin'), deleteJob);

export default router;
