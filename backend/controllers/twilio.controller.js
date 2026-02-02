import twilio from "twilio";

/**
 * Initialize Twilio client
 */
const getTwilioClient = () => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error("Twilio credentials not configured");
    }

    return twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
};

/**
 * Normalize phone number to E.164 format
 * Assumes Indian numbers if 10 digits are provided
 */
const normalizePhoneNumber = (phone) => {
    if (!phone) return null;

    // Remove spaces, dashes, brackets
    const cleaned = phone.replace(/[\s\-()]/g, "");

    // Already E.164
    if (cleaned.startsWith("+")) {
        return cleaned;
    }

    // Indian mobile number
    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    }

    return null;
};

/**
 * Initiate an outbound call using Twilio
 * POST /api/twilio/call
 * Body: { phoneNumber }
 */
export const initiateCall = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }

        // Normalize TO number
        const to = normalizePhoneNumber(phoneNumber);
        if (!to) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number format",
            });
        }

        // FROM number must be Twilio-owned VOICE number
        const from = process.env.TWILIO_PHONE_NUMBER;
        if (!from) {
            return res.status(500).json({
                success: false,
                message: "Twilio phone number not configured",
            });
        }

        console.log("📞 Initiating call");
        console.log("FROM:", from);
        console.log("TO:", to);

        const client = getTwilioClient();

        // Create call
        const call = await client.calls.create({
            from: from,
            to: to,
            twiml: `
        <Response>
          <Say voice="alice">
            Hello. This call is from CityConnect.
            Someone is interested in the job vacancy you posted.
          </Say>
        </Response>
      `,
        });

        console.log("✅ Call initiated:", call.sid);

        return res.json({
            success: true,
            message: "Call initiated successfully",
            callSid: call.sid,
            from,
            to,
        });

    } catch (error) {
        console.error("❌ Twilio Call Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to initiate call",
            code: error.code,
        });
    }
};

/**
 * Initiate an outbound call with a specific TwiML URL
 */
export const initiateCallWithUrl = async (req, res) => {
    try {
        const { phoneNumber, url } = req.body;

        if (!phoneNumber || !url) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and TwiML URL are required',
            });
        }

        const to = normalizePhoneNumber(phoneNumber);
        const client = getTwilioClient();

        const call = await client.calls.create({
            url: url,
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER,
        });

        res.json({
            success: true,
            message: 'Call with URL initiated successfully',
            data: { callSid: call.sid },
        });
    } catch (error) {
        console.error('Twilio Call URL Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to initiate call with URL',
            code: error.code,
        });
    }
};