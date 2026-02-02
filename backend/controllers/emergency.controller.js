// Emergency Services Controller

// SOS Request
export const sendSOS = async (req, res) => {
  try {
    const { location, emergencyType, message } = req.body;

    // In a real application, this would trigger actual emergency services
    // For now, we'll just log and return a success response

    const sosData = {
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      location: location || 'Location not provided',
      emergencyType: emergencyType || 'General Emergency',
      message: message || 'SOS Request',
      timestamp: new Date(),
    };

    // In production, this would:
    // 1. Send notification to emergency services
    // 2. Share location with authorities
    // 3. Log the emergency request

    res.json({
      success: true,
      message: 'SOS request sent successfully. Help is on the way!',
      data: { sosRequest: sosData },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send SOS request',
      error: error.message,
    });
  }
};

// Get Emergency Contacts
export const getEmergencyContacts = async (req, res) => {
  try {
    // Mock emergency contacts
    const contacts = [
      {
        name: 'Police',
        number: '100',
        type: 'Police',
      },
      {
        name: 'Fire Department',
        number: '101',
        type: 'Fire',
      },
      {
        name: 'Ambulance',
        number: '102',
        type: 'Medical',
      },
      {
        name: 'Emergency Helpline',
        number: '108',
        type: 'General',
      },
    ];

    res.json({
      success: true,
      data: { contacts },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency contacts',
      error: error.message,
    });
  }
};
