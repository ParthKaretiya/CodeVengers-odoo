const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const maintenanceService = require('../services/maintenance.service');

const getAllMaintenance = async (req, res, next) => {
  try {
    const { status, vehicle_id } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (vehicle_id) {
      where.vehicle_id = parseInt(vehicle_id);
    }

    const maintenanceLogs = await prisma.maintenanceLog.findMany({
      where,
      include: {
        vehicle: true
      },
      orderBy: {
        opened_at: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: maintenanceLogs
    });
  } catch (error) {
    next(error);
  }
};

const getMaintenanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const maintenanceLog = await prisma.maintenanceLog.findUnique({
      where: { id: parseInt(id) },
      include: {
        vehicle: true
      }
    });

    if (!maintenanceLog) {
      throw new AppError('Maintenance log not found', 404, 'MAINTENANCE_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: maintenanceLog
    });
  } catch (error) {
    next(error);
  }
};

const createMaintenance = async (req, res, next) => {
  try {
    const { vehicle_id, description, cost, priority } = req.body;

    if (!vehicle_id || !description || cost == null || !priority) {
      throw new AppError('All fields are required', 400, 'MISSING_FIELDS');
    }

    const maintenanceLog = await maintenanceService.create({
      vehicle_id: parseInt(vehicle_id),
      description,
      cost: parseFloat(cost),
      priority
    });

    res.status(201).json({
      success: true,
      data: maintenanceLog
    });
  } catch (error) {
    next(error);
  }
};

const closeMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { closing_notes } = req.body;

    const maintenanceLog = await maintenanceService.close(id, closing_notes);

    res.status(200).json({
      success: true,
      data: maintenanceLog
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  closeMaintenance
};
