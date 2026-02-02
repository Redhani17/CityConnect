import Complaint from '../models/Complaint.model.js';

// Submit Complaint (Citizen)
export const submitComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      location,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: { complaint },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint',
      error: error.message,
    });
  }
};

// Get User's Complaints (Citizen)
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json({
      success: true,
      data: { complaints },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
};

// Get All Complaints (Admin)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json({
      success: true,
      data: { complaints },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
};

// Get Single Complaint
export const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'userId',
      'name email'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.json({
      success: true,
      data: { complaint },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message,
    });
  }
};

// Update Complaint Status (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedDepartment, adminRemarks } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (status) complaint.status = status;
    if (assignedDepartment) complaint.assignedDepartment = assignedDepartment;
    if (adminRemarks) complaint.adminRemarks = adminRemarks;

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: { complaint },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint',
      error: error.message,
    });
  }
};
