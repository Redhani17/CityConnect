import express from 'express';
import {
  getMyBills,
  getBill,
  payBill,
  getPaymentHistory,
  createMockBill,
} from '../controllers/bill.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Citizen routes
router.get('/my-bills', authenticate, getMyBills);
router.get('/payment-history', authenticate, getPaymentHistory);
router.get('/:id', authenticate, getBill);
router.post('/:id/pay', authenticate, payBill);

// Admin route (for creating mock bills)
router.post('/create-mock', authenticate, authorize('admin'), createMockBill);

export default router;
