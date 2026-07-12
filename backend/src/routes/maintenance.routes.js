const express = require('express');
const {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  closeMaintenance
} = require('../controllers/maintenance.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All maintenance routes require authentication
router.use(authenticate);

// Get all maintenance logs (fleet_manager and financial_analyst) - optional filters: status, vehicle_id
router.get('/', authorize('fleet_manager', 'financial_analyst'), getAllMaintenance);

// Get maintenance log by id (fleet_manager only)
router.get('/:id', authorize('fleet_manager'), getMaintenanceById);

// Create maintenance log (fleet_manager only)
router.post('/', authorize('fleet_manager'), createMaintenance);

// Close maintenance log (fleet_manager only) - requires closing_notes
router.patch('/:id/close', authorize('fleet_manager'), closeMaintenance);

module.exports = router;
