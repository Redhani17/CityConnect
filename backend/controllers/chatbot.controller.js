import crypto from 'crypto';

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Chat endpoint using Groq AI
 * POST /api/chatbot/chat
 */
export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'GROQ_API_KEY is not configured on the server.',
      });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    const requestId = crypto.randomUUID();

    const groqResponse = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'You are CityConnect AI Assistant. Help users with city services like complaints, bills, emergencies, announcements, and jobs. Be concise, professional, and practical. If asked about something unrelated to city services, politely steer the conversation back to how you can help with city matters.',
          },
          { role: 'user', content: message },
        ],
      }),
    });

    const payload = await groqResponse.json().catch(() => null);

    if (!groqResponse.ok) {
      return res.status(502).json({
        success: false,
        message: payload?.error?.message || 'Groq request failed',
        error: payload || { status: groqResponse.status },
        requestId,
      });
    }

    const assistantMessage = payload?.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(502).json({
        success: false,
        message: 'Groq response was missing assistant content',
        error: payload,
        requestId,
      });
    }

    return res.json({
      success: true,
      data: {
        message: assistantMessage,
      },
      requestId,
    });
  } catch (error) {
    console.error('Groq Chatbot Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Groq chatbot error',
      error: error.message,
    });
  }
};

/**
 * Get FAQ suggestions for the UI
 * GET /api/chatbot/suggestions
 */
export const getFAQSuggestions = async (req, res) => {
  try {
    const suggestions = [
      'How do I file a complaint?',
      'Where can I pay my bills?',
      'What should I do in an emergency?',
      'Are there any job opportunities?',
      'Show me city announcements',
    ];

    res.json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions',
      error: error.message,
    });
  }
};
