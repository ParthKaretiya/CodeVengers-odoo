const expenseService = require('../services/expense.service');
const AppError = require('../utils/AppError');

const getAllExpenses = async (req, res, next) => {
  try {
    const { vehicle_id, type, from, to } = req.query;
    const expenses = await expenseService.getAll({
      vehicle_id,
      type,
      from,
      to
    });

    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const { vehicle_id, type, amount, date } = req.body;

    if (!vehicle_id || !type || !amount) {
      throw new AppError('Vehicle ID, type, and amount are required', 400, 'MISSING_FIELDS');
    }

    const expense = await expenseService.create({
      vehicle_id: parseInt(vehicle_id),
      type,
      amount,
      date
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExpenses,
  createExpense
};
