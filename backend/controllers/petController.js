const Pet = require('../models/Pet');

// @desc    Get all pets with filters, search, and pagination
// @route   GET /api/pets
// @access  Public
exports.getPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by name or breed
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { breed: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by species
    if (req.query.species) {
      query.species = req.query.species;
    }

    // Filter by breed
    if (req.query.breed) {
      query.breed = { $regex: req.query.breed, $options: 'i' };
    }

    // Filter by age range
    if (req.query.minAge || req.query.maxAge) {
      query.age = {};
      if (req.query.minAge) query.age.$gte = parseInt(req.query.minAge);
      if (req.query.maxAge) query.age.$lte = parseInt(req.query.maxAge);
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    } else if (req.query.adminView !== 'true') {
      // By default, only show available pets to public (not for admin view)
      query.status = 'Available';
    }
    // If adminView is true, don't filter by status at all

    // Filter by gender
    if (req.query.gender) {
      query.gender = req.query.gender;
    }

    // Filter by size
    if (req.query.size) {
      query.size = req.query.size;
    }

    // Get total count for pagination
    const total = await Pet.countDocuments(query);

    // Execute query with pagination
    const pets = await Pet.find(query)
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: pets.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('addedBy', 'name email');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private/Admin
exports.createPet = async (req, res) => {
  try {
    // Add user to req.body
    req.body.addedBy = req.user._id;

    // Handle photo uploads
    let photoUrls = [];
    if (req.body.photos && Array.isArray(req.body.photos)) {
      photoUrls = req.body.photos;
    }

    const pet = await Pet.create({
      ...req.body,
      photos: photoUrls
    });

    res.status(201).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
exports.updatePet = async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    await pet.deleteOne();

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

// @desc    Upload pet photos
// @route   POST /api/pets/:id/photos
// @access  Private/Admin
exports.uploadPhotos = async (req, res) => {
  try {
    console.log('Upload photos request received');
    console.log('Files received:', req.files ? req.files.length : 0);
    
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one photo'
      });
    }

    // Use local file paths with Multer
    const photoUrls = req.files.map(file => {
      console.log('Processing file:', file.filename);
      return `/uploads/${file.filename}`;
    });
    
    console.log('Photo URLs created:', photoUrls);

    pet.photos = [...pet.photos, ...photoUrls];
    await pet.save();
    
    console.log('Pet updated with photos. Total photos:', pet.photos.length);

    res.status(200).json({
      success: true,
      data: pet,
      message: `Successfully uploaded ${photoUrls.length} image(s)`
    });
  } catch (error) {
    console.error('Error in uploadPhotos:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get pet statistics
// @route   GET /api/pets/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const stats = await Pet.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const speciesStats = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        speciesStats: speciesStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

