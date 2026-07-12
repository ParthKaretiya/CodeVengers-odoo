const express = require('express');
const {
  getAllFuelLogs,
  createFuelLog
} = require('../controllers/fuelLog.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All fuel log routes require authentication
router.use(authenticate);

// Get all fuel logs (fleet_manager and financial_analyst) - optional filters: vehicle_id, from, to
router.get('/', authorize('fleet_manager', 'financial_analyst'), getAllFuelLogs);

// Create fuel log (fleet_manager and driver)
router.post('/', authorize('fleet_manager', 'driver'), createFuelLog);

module.exports = router;
