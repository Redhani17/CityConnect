import express from 'express';
import { chat, getFAQSuggestions } from '../controllers/chatbot.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/chat', authenticate, chat);
router.get('/suggestions', authenticate, getFAQSuggestions);

export default router;
