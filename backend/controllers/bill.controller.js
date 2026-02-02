import Bill from '../models/Bill.model.js';
import Payment from '../models/Payment.model.js';

// Get User's Bills
export const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: { bills },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills',
      error: error.message,
    });
  }
};

// Get Single Bill
export const getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    // Check if user owns the bill
    if (bill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { bill },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill',
      error: error.message,
    });
  }
};

// Mock Payment
export const payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    if (bill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (bill.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Bill is already paid',
      });
    }

    // Generate mock transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const payment = await Payment.create({
      userId: req.user._id,
      billId: bill._id,
      amount: bill.amount,
      transactionId,
      status: 'Success',
    });

    // Update bill status
    bill.status = 'Paid';
    await bill.save();

    res.json({
      success: true,
      message: 'Payment successful (Mock)',
      data: { payment, bill },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment failed',
      error: error.message,
    });
  }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('billId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { payments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message,
    });
  }
};

// Create Mock Bills (Admin only - for testing)
export const createMockBill = async (req, res) => {
  try {
    const { userId, billType, amount, dueDate, billNumber, period } = req.body;

    const bill = await Bill.create({
      userId,
      billType,
      amount,
      dueDate,
      billNumber,
      period,
    });

    res.status(201).json({
      success: true,
      message: 'Mock bill created',
      data: { bill },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create bill',
      error: error.message,
    });
  }
};
