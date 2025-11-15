const Application = require('../models/Application');
const Pet = require('../models/Pet');

// @desc    Create new adoption application
// @route   POST /api/applications
// @access  Private/User
exports.createApplication = async (req, res) => {
  try {
    const { pet, applicantInfo } = req.body;

    // Check if pet exists and is available
    const petDoc = await Pet.findById(pet);
    if (!petDoc) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    if (petDoc.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'This pet is not available for adoption'
      });
    }

    // Check if user already applied for this pet
    const existingApplication = await Application.findOne({
      pet,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this pet'
      });
    }

    // Create application
    const application = await Application.create({
      pet,
      applicant: req.user._id,
      applicantInfo
    });

    // Update pet status to Pending
    petDoc.status = 'Pending';
    await petDoc.save();

    // Populate the application
    await application.populate('pet');
    await application.populate('applicant', 'name email');

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all applications (Admin) or user's applications
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res) => {
  try {
    let query = {};

    // If not admin, only show user's own applications
    if (req.user.role !== 'admin') {
      query.applicant = req.user._id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Application.countDocuments(query);

    const applications = await Application.find(query)
      .populate('pet')
      .populate('applicant', 'name email phone')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('pet')
      .populate('applicant', 'name email phone address')
      .populate('reviewedBy', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization (own application or admin)
    if (req.user.role !== 'admin' && application.applicant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update application status (Approve/Reject)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Approved or Rejected'
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'This application has already been reviewed'
      });
    }

    // Update application
    application.status = status;
    application.notes = notes;
    application.reviewedBy = req.user._id;
    application.reviewedAt = Date.now();
    await application.save();

    // Update pet status
    const pet = await Pet.findById(application.pet);
    if (pet) {
      if (status === 'Approved') {
        pet.status = 'Adopted';
        
        // Reject all other pending applications for this pet
        await Application.updateMany(
          { pet: pet._id, status: 'Pending', _id: { $ne: application._id } },
          { 
            status: 'Rejected', 
            notes: 'Pet has been adopted by another applicant',
            reviewedBy: req.user._id,
            reviewedAt: Date.now()
          }
        );
      } else if (status === 'Rejected') {
        // Check if there are other pending applications
        const pendingCount = await Application.countDocuments({
          pet: pet._id,
          status: 'Pending'
        });
        
        // If no pending applications, set pet back to Available
        if (pendingCount === 0) {
          pet.status = 'Available';
        }
      }
      await pet.save();
    }

    await application.populate('pet');
    await application.populate('applicant', 'name email');
    await application.populate('reviewedBy', 'name');

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization (own application or admin)
    if (req.user.role !== 'admin' && application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    // Can only delete pending applications
    if (application.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete reviewed application'
      });
    }

    await application.deleteOne();

    // Check if pet should be set back to Available
    const pet = await Pet.findById(application.pet);
    if (pet && pet.status === 'Pending') {
      const pendingCount = await Application.countDocuments({
        pet: pet._id,
        status: 'Pending'
      });
      
      if (pendingCount === 0) {
        pet.status = 'Available';
        await pet.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

