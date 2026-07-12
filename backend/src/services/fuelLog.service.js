const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

const create = async (payload) => {
  const { vehicle_id, liters, cost, date } = payload;

  // Validate vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicle_id }
  });
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404, 'VEHICLE_NOT_FOUND');
  }

  // Validate positive numbers
  if (liters <= 0) {
    throw new AppError('Liters must be positive', 400, 'INVALID_LITERS');
  }
  if (cost <= 0) {
    throw new AppError('Cost must be positive', 400, 'INVALID_COST');
  }

  return await prisma.fuelLog.create({
    data: {
      vehicle_id,
      liters: parseFloat(liters),
      cost: parseFloat(cost),
      date: date ? new Date(date) : new Date()
    },
    include: {
      vehicle: true
    }
  });
};

const getAll = async (filters = {}) => {
  const { vehicle_id, from, to } = filters;
  const where = {};

  if (vehicle_id) {
    where.vehicle_id = parseInt(vehicle_id);
  }
  if (from || to) {
    where.date = {};
    if (from) {
      where.date.gte = new Date(from);
    }
    if (to) {
      where.date.lte = new Date(to);
    }
  }

  return await prisma.fuelLog.findMany({
    where,
    include: {
      vehicle: true
    },
    orderBy: {
      date: 'desc'
    }
  });
};

module.exports = {
  create,
  getAll
};
