const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getStats
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { applicationValidation, validate } = require('../middleware/validator');

// Protected routes
router.post('/', protect, applicationValidation, validate, createApplication);
router.get('/', protect, getApplications);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/:id', protect, getApplication);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);

module.exports = router;

