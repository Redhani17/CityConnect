import express from 'express';
import {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaint,
  updateComplaintStatus,
} from '../controllers/complaint.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Citizen routes
router.post('/', authenticate, upload.single('image'), submitComplaint);
router.get('/my-complaints', authenticate, getMyComplaints);

// Admin routes
router.get('/all', authenticate, authorize('admin'), getAllComplaints);
router.get('/:id', authenticate, getComplaint);
router.put('/:id/status', authenticate, authorize('admin', 'department'), updateComplaintStatus);

export default router;
