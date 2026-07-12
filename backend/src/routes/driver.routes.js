const express = require('express');
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  suspendDriver
} = require('../controllers/driver.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All authenticated users can read
router.get('/', authenticate, getAllDrivers);
router.get('/:id', authenticate, getDriverById);

// Only fleet manager can create/delete
router.post('/', authenticate, authorize('fleet_manager'), createDriver);
router.delete('/:id', authenticate, authorize('fleet_manager'), deleteDriver);

// Fleet manager and safety officer can update
router.put('/:id', authenticate, authorize('fleet_manager', 'safety_officer'), updateDriver);

// Only safety officer can suspend
router.patch('/:id/suspend', authenticate, authorize('safety_officer'), suspendDriver);

module.exports = router;
