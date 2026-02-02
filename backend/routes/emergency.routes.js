import express from 'express';
import { sendSOS, getEmergencyContacts } from '../controllers/emergency.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/sos', authenticate, sendSOS);
router.get('/contacts', authenticate, getEmergencyContacts);

export default router;
