const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

const create = async (payload) => {
  const { vehicle_id, description, cost, priority } = payload;

  // Validate vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicle_id }
  });
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404, 'VEHICLE_NOT_FOUND');
  }

  // Use transaction to create maintenance log AND update vehicle status to in_shop
  return await prisma.$transaction(async (tx) => {
    const maintenanceLog = await tx.maintenanceLog.create({
      data: {
        vehicle_id,
        description,
        cost,
        priority,
        status: 'open'
      },
      include: {
        vehicle: true
      }
    });

    // Update vehicle status to in_shop
    await tx.vehicle.update({
      where: { id: vehicle_id },
      data: { status: 'in_shop' }
    });

    return maintenanceLog;
  });
};

const close = async (id, closingNotes) => {
  // First get the maintenance log to check its status and get vehicle_id
  const maintenanceLog = await prisma.maintenanceLog.findUnique({
    where: { id: parseInt(id) },
    include: { vehicle: true }
  });

  if (!maintenanceLog) {
    throw new AppError('Maintenance log not found', 404, 'MAINTENANCE_NOT_FOUND');
  }

  if (maintenanceLog.status === 'closed') {
    throw new AppError('Maintenance log is already closed', 400, 'ALREADY_CLOSED');
  }

  // Transaction to close log and update vehicle status (if not retired)
  return await prisma.$transaction(async (tx) => {
    const updatedLog = await tx.maintenanceLog.update({
      where: { id: parseInt(id) },
      data: {
        status: 'closed',
        closed_at: new Date(),
        closing_notes: closingNotes
      },
      include: {
        vehicle: true
      }
    });

    // Only set vehicle back to available if it's not retired!
    if (updatedLog.vehicle.status !== 'retired') {
      await tx.vehicle.update({
        where: { id: updatedLog.vehicle_id },
        data: { status: 'available' }
      });
    }

    return updatedLog;
  });
};

module.exports = {
  create,
  close
};
