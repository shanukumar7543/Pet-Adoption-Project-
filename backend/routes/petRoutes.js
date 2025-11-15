const express = require('express');
const router = express.Router();
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  uploadPhotos,
  getStats
} = require('../controllers/petController');
const { protect, authorize } = require('../middleware/auth');
const { petValidation, validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getPets);
router.get('/:id', getPet);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), petValidation, validate, createPet);
router.put('/:id', protect, authorize('admin'), updatePet);
router.delete('/:id', protect, authorize('admin'), deletePet);
router.post('/:id/photos', protect, authorize('admin'), upload.array('photos', 10), uploadPhotos);
router.get('/admin/stats', protect, authorize('admin'), getStats);

module.exports = router;

