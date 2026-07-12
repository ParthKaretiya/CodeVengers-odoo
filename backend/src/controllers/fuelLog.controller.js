const fuelLogService = require('../services/fuelLog.service');
const AppError = require('../utils/AppError');

const getAllFuelLogs = async (req, res, next) => {
  try {
    const { vehicle_id, from, to } = req.query;
    const fuelLogs = await fuelLogService.getAll({
      vehicle_id,
      from,
      to
    });

    res.status(200).json({
      success: true,
      data: fuelLogs
    });
  } catch (error) {
    next(error);
  }
};

const createFuelLog = async (req, res, next) => {
  try {
    const { vehicle_id, liters, cost, date } = req.body;

    if (!vehicle_id || !liters || !cost) {
      throw new AppError('Vehicle ID, liters, and cost are required', 400, 'MISSING_FIELDS');
    }

    const fuelLog = await fuelLogService.create({
      vehicle_id: parseInt(vehicle_id),
      liters,
      cost,
      date
    });

    res.status(201).json({
      success: true,
      data: fuelLog
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFuelLogs,
  createFuelLog
};
