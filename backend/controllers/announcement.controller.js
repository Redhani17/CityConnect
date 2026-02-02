import Announcement from '../models/Announcement.model.js';

// Create Announcement (Admin)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, category, date, location, targetDepartment } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and date',
      });
    }

    const announcementData = {
      title,
      description,
      category: category || 'General',
      date,
      location,
      createdBy: req.user._id,
    };

    // If user is department, force the targetDepartment to their own
    if (req.user.role === 'department') {
      announcementData.targetDepartment = req.user.department;
    } else {
      announcementData.targetDepartment = targetDepartment || null;
    }

    const announcement = await Announcement.create(announcementData);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: { announcement },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message,
    });
  }
};

// Get All Announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };

    // If user is department, filter EXCLUSIVELY by their department
    if (req.user.role === 'department') {
      query.targetDepartment = req.user.department;
    }

    if (category) {
      query.category = category;
    }

    const announcements = await Announcement.find(query)
      .sort({ date: -1 })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: { announcements },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message,
    });
  }
};

// Get Single Announcement
export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      'createdBy',
      'name'
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    res.json({
      success: true,
      data: { announcement },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement',
      error: error.message,
    });
  }
};

// Update Announcement (Admin)
export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Authorization check for department users
    if (req.user.role === 'department' && announcement.targetDepartment !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update announcements for your department.',
      });
    }

    const { title, description, category, date, location, targetDepartment, isActive } = req.body;

    if (title) announcement.title = title;
    if (description) announcement.description = description;
    if (category) announcement.category = category;
    if (date) announcement.date = date;
    if (location !== undefined) announcement.location = location;
    if (targetDepartment !== undefined) announcement.targetDepartment = targetDepartment;
    if (isActive !== undefined) announcement.isActive = isActive;

    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: { announcement },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update announcement',
      error: error.message,
    });
  }
};

// Delete Announcement (Admin)
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Authorization check for department users
    if (req.user.role === 'department' && announcement.targetDepartment !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete announcements for your department.',
      });
    }

    await announcement.deleteOne();

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message,
    });
  }
};
