const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

const checkRegNumberUniqueness = async (regNumber, excludeId = null) => {
  const existing = await prisma.vehicle.findFirst({
    where: {
      reg_number: { equals: regNumber, mode: 'insensitive' },
      ...(excludeId && { NOT: { id: excludeId } })
    }
  });
  if (existing) {
    throw new AppError('Registration number already exists', 409, 'REG_NUMBER_EXISTS');
  }
};

const validateStatusUpdate = (oldStatus, newStatus) => {
  if (newStatus === 'on_trip') {
    throw new AppError('Cannot directly set status to on_trip - only Trip dispatch flow can do this', 400, 'INVALID_STATUS_TRANSITION');
  }
};

const getVehicleCosts = async (vehicleId) => {
  const [fuelTotal, maintenanceTotal, expenseTotal] = await Promise.all([
    prisma.fuelLog.aggregate({
      where: { vehicle_id: vehicleId },
      _sum: { cost: true }
    }),
    prisma.maintenanceLog.aggregate({
      where: { vehicle_id: vehicleId },
      _sum: { cost: true }
    }),
    prisma.expense.aggregate({
      where: { vehicle_id: vehicleId },
      _sum: { amount: true }
    })
  ]);

  const fuelTotalNum = fuelTotal._sum.cost ? parseFloat(fuelTotal._sum.cost) : 0;
  const maintenanceTotalNum = maintenanceTotal._sum.cost ? parseFloat(maintenanceTotal._sum.cost) : 0;
  const expenseTotalNum = expenseTotal._sum.amount ? parseFloat(expenseTotal._sum.amount) : 0;

  return {
    fuelTotal: fuelTotalNum,
    maintenanceTotal: maintenanceTotalNum,
    expenseTotal: expenseTotalNum,
    operationalCost: fuelTotalNum + maintenanceTotalNum + expenseTotalNum
  };
};

module.exports = {
  checkRegNumberUniqueness,
  validateStatusUpdate,
  getVehicleCosts
};
