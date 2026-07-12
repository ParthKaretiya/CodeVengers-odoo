const express = require('express');
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleCosts
} = require('../controllers/vehicle.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All authenticated users can read
router.get('/', authenticate, getAllVehicles);
router.get('/:id', authenticate, getVehicleById);

// Only fleet manager can create/update/delete
router.post('/', authenticate, authorize('fleet_manager'), createVehicle);
router.put('/:id', authenticate, authorize('fleet_manager'), updateVehicle);
router.delete('/:id', authenticate, authorize('fleet_manager'), deleteVehicle);

// Fleet manager and financial analyst can get costs
router.get('/:id/costs', authenticate, authorize('fleet_manager', 'financial_analyst'), getVehicleCosts);

module.exports = router;
