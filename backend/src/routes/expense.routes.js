const express = require('express');
const {
  getAllExpenses,
  createExpense
} = require('../controllers/expense.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All expense routes require authentication
router.use(authenticate);

// Get all expenses (fleet_manager and financial_analyst) - optional filters: vehicle_id, type, from, to
router.get('/', authorize('fleet_manager', 'financial_analyst'), getAllExpenses);

// Create expense (fleet_manager only)
router.post('/', authorize('fleet_manager'), createExpense);

module.exports = router;
