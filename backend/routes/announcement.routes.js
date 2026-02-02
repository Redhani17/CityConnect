import express from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (authenticated users)
router.get('/', authenticate, getAllAnnouncements);
router.get('/:id', authenticate, getAnnouncement);

// Admin routes
router.post('/', authenticate, authorize('admin'), createAnnouncement);
router.put('/:id', authenticate, authorize('admin'), updateAnnouncement);
router.delete('/:id', authenticate, authorize('admin'), deleteAnnouncement);

export default router;
