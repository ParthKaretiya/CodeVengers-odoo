const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

const create = async (payload) => {
  const { vehicle_id, type, amount, date } = payload;

  // Validate vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicle_id }
  });
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404, 'VEHICLE_NOT_FOUND');
  }

  // Validate positive amount
  if (amount <= 0) {
    throw new AppError('Amount must be positive', 400, 'INVALID_AMOUNT');
  }

  return await prisma.expense.create({
    data: {
      vehicle_id,
      type,
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date()
    },
    include: {
      vehicle: true
    }
  });
};

const getAll = async (filters = {}) => {
  const { vehicle_id, type, from, to } = filters;
  const where = {};

  if (vehicle_id) {
    where.vehicle_id = parseInt(vehicle_id);
  }
  if (type) {
    where.type = type;
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

  return await prisma.expense.findMany({
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
