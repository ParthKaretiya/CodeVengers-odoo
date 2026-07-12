const { prisma } = require('../config/db');
const { checkRegNumberUniqueness, validateStatusUpdate, getVehicleCosts } = require('../services/vehicle.service');
const AppError = require('../utils/AppError');

const getAllVehicles = async (req, res, next) => {
  try {
    const { status, type, region, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (type) where.type = { contains: type, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { reg_number: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    const vehicles = await prisma.vehicle.findMany({ where });

    res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) },
      include: {
        trips: true,
        maintenanceLogs: true
      }
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const { reg_number, name, type, max_capacity, odometer, acquisition_cost } = req.body;

    if (!reg_number || !name || !type || !max_capacity || odometer == null || acquisition_cost == null) {
      throw new AppError('All fields are required', 400, 'MISSING_FIELDS');
    }

    await checkRegNumberUniqueness(reg_number);

    const vehicle = await prisma.vehicle.create({
      data: {
        reg_number,
        name,
        type,
        max_capacity: parseInt(max_capacity),
        odometer: parseInt(odometer),
        acquisition_cost: parseFloat(acquisition_cost)
      }
    });

    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reg_number, status, ...updateData } = req.body;

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingVehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    }

    if (reg_number) {
      await checkRegNumberUniqueness(reg_number, parseInt(id));
      updateData.reg_number = reg_number;
    }

    if (status) {
      validateStatusUpdate(existingVehicle.status, status);
      updateData.status = status;
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.vehicle.findUniqueOrThrow({ where: { id: parseInt(id) } });

    await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: { status: 'retired' }
    });

    res.status(200).json({
      success: true,
      data: { success: true }
    });
  } catch (error) {
    next(error);
  }
};

const getVehicleCosts = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.vehicle.findUniqueOrThrow({ where: { id: parseInt(id) } });

    const costs = await getVehicleCosts(parseInt(id));

    res.status(200).json({
      success: true,
      data: costs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleCosts
};
