// Rule-based Chatbot Controller

const faqDatabase = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      'Hello! How can I help you today?',
      'Hi there! What can I assist you with?',
      'Greetings! I\'m here to help with city services.',
    ],
  },
  complaints: {
    patterns: ['complaint', 'file complaint', 'submit complaint', 'report issue', 'problem'],
    responses: [
      'You can submit a complaint by going to the Complaints section. Click on "Submit New Complaint" and fill in the details.',
      'To file a complaint, navigate to Complaints → Submit New Complaint. Provide title, description, category, and location.',
    ],
  },
  bills: {
    patterns: ['bill', 'payment', 'pay bill', 'electricity', 'water', 'property tax', 'due date'],
    responses: [
      'You can view and pay your bills in the Bills section. All pending bills will be shown there.',
      'Go to the Bills section to see your electricity, water, and property tax bills. You can pay them directly from there.',
    ],
  },
  emergency: {
    patterns: ['emergency', 'sos', 'help', 'urgent', 'accident'],
    responses: [
      'For emergencies, use the SOS button in the Emergency Services section. You can also call 108 for immediate help.',
      'In case of emergency, click the SOS button or call the emergency helpline at 108.',
    ],
  },
  jobs: {
    patterns: ['job', 'employment', 'opportunity', 'vacancy', 'career', 'apply'],
    responses: [
      'Check the Jobs & Opportunities section to see available positions posted by the city administration.',
      'Visit the Jobs section to browse local job opportunities and contact information.',
    ],
  },
  announcements: {
    patterns: ['announcement', 'event', 'news', 'update', 'notice'],
    responses: [
      'City announcements and events are available in the Announcements section. Check there for the latest updates.',
      'Go to Announcements to see city events, notices, and important updates.',
    ],
  },
  default: {
    responses: [
      'I can help you with complaints, bills, emergencies, jobs, and announcements. What would you like to know?',
      'I\'m here to assist with city services. You can ask about complaints, bill payments, emergency services, jobs, or announcements.',
      'How can I help you today? I can provide information about city services, complaints, bills, and more.',
    ],
  },
};

// Find matching intent
const findIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [intent, data] of Object.entries(faqDatabase)) {
    if (intent === 'default') continue;
    
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        return intent;
      }
    }
  }
  
  return 'default';
};

// Get response
const getResponse = (intent) => {
  const intentData = faqDatabase[intent];
  if (intentData && intentData.responses) {
        const responses = intentData.responses;
        return responses[Math.floor(Math.random() * responses.length)];
  }
  return faqDatabase.default.responses[
    Math.floor(Math.random() * faqDatabase.default.responses.length)
  ];
};

// Chat endpoint
export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    const intent = findIntent(message);
    const response = getResponse(intent);

    res.json({
      success: true,
      data: {
        message: response,
        intent: intent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Chatbot error',
      error: error.message,
    });
  }
};

// Get FAQ suggestions
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
