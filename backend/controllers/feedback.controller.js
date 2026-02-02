import Feedback from '../models/Feedback.model.js';

// Submit Feedback (Citizen)
export const submitFeedback = async (req, res) => {
    try {
        const { rating, suggestion } = req.body;

        if (!rating || !suggestion) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both rating and suggestion',
            });
        }

        const feedback = await Feedback.create({
            userId: req.user._id,
            rating: Number(rating),
            suggestion,
        });

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully. Thank you!',
            data: { feedback },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message,
        });
    }
};

// Get All Feedback (Admin)
export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { feedback },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message,
        });
    }
};
