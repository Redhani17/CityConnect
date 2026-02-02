import express from 'express';
import { initiateCall, initiateCallWithUrl } from '../controllers/twilio.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /api/twilio/call
 * Initiate an outbound call to a phone number
 * Required auth
 */
router.post('/call', authenticate, initiateCall);

/**
 * POST /api/twilio/call-with-url
 * Alternative endpoint for calls with dynamic TwiML
 */
router.post('/call-with-url', authenticate, initiateCallWithUrl);

/**
 * GET /api/twilio/health
 * Quick health check for Twilio config
 */
router.get('/health', (req, res) => {
    const hasAccountSid = !!process.env.TWILIO_ACCOUNT_SID;
    const hasAuthToken = !!process.env.TWILIO_AUTH_TOKEN;
    const hasPhoneNumber = !!process.env.TWILIO_PHONE_NUMBER;

    res.json({
        success: hasAccountSid && hasAuthToken && hasPhoneNumber,
        twilio: {
            accountSid: hasAccountSid ? process.env.TWILIO_ACCOUNT_SID.substring(0, 5) + '...' : 'NOT SET',
            authToken: hasAuthToken ? '***hidden***' : 'NOT SET',
            phoneNumber: hasPhoneNumber ? process.env.TWILIO_PHONE_NUMBER : 'NOT SET',
        },
    });
});

export default router;
