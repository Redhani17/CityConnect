import Job from '../models/Job.model.js';

// Create Job (Admin)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      location,
      salary,
      requirements,
      contactEmail,
      contactPhone,
    } = req.body;

    if (!title || !description || !department || !location || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const job = await Job.create({
      title,
      description,
      department,
      location,
      salary: salary || 'Not specified',
      requirements,
      contactEmail,
      contactPhone,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: { job },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to post job',
      error: error.message,
    });
  }
};

// Get All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const { department, location } = req.query;
    const query = { isActive: true };

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name');

    res.json({
      success: true,
      data: { jobs },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    });
  }
};

// Get Single Job
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({
      success: true,
      data: { job },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message,
    });
  }
};

// Update Job (Admin)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    const {
      title,
      description,
      department,
      location,
      salary,
      requirements,
      contactEmail,
      contactPhone,
      isActive,
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (department) job.department = department;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (requirements) job.requirements = requirements;
    if (contactEmail) job.contactEmail = contactEmail;
    if (contactPhone) job.contactPhone = contactPhone;
    if (isActive !== undefined) job.isActive = isActive;

    await job.save();

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message,
    });
  }
};

// Delete Job (Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message,
    });
  }
};
