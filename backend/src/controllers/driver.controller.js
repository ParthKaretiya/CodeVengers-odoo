const { prisma } = require('../config/db');
const { addIsLicenseExpiredToDriver } = require('../services/driver.service');
const AppError = require('../utils/AppError');

const getAllDrivers = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { license_number: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } }
      ];
    }

    const drivers = await prisma.driver.findMany({ where });
    const driversWithExpiry = drivers.map(driver => addIsLicenseExpiredToDriver(driver));

    res.status(200).json({
      success: true,
      data: driversWithExpiry
    });
  } catch (error) {
    next(error);
  }
};

const getDriverById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(id) },
      include: {
        trips: true
      }
    });

    if (!driver) {
      throw new AppError('Driver not found', 404, 'NOT_FOUND');
    }

    const driverWithExpiry = addIsLicenseExpiredToDriver(driver);
    // Rename trips to tripHistory as per spec
    const { trips, ...driverWithoutTrips } = driverWithExpiry;
    const driverWithTripHistory = {
      ...driverWithoutTrips,
      tripHistory: trips
    };

    res.status(200).json({
      success: true,
      data: driverWithTripHistory
    });
  } catch (error) {
    next(error);
  }
};

const createDriver = async (req, res, next) => {
  try {
    const { name, license_number, license_category, license_expiry, contact, safety_score } = req.body;

    if (!name || !license_number || !license_category || !license_expiry || !contact || safety_score == null) {
      throw new AppError('All fields are required', 400, 'MISSING_FIELDS');
    }

    // Check if license_number is unique
    const existingDriver = await prisma.driver.findFirst({
      where: { license_number: { equals: license_number, mode: 'insensitive' } }
    });
    if (existingDriver) {
      throw new AppError('License number already exists', 409, 'LICENSE_NUMBER_EXISTS');
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        license_number,
        license_category,
        license_expiry: new Date(license_expiry),
        contact,
        safety_score: parseInt(safety_score)
      }
    });

    const driverWithExpiry = addIsLicenseExpiredToDriver(driver);

    res.status(201).json({
      success: true,
      data: driverWithExpiry
    });
  } catch (error) {
    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert date if provided
    if (updateData.license_expiry) {
      updateData.license_expiry = new Date(updateData.license_expiry);
    }

    // Parse numbers if provided
    if (updateData.safety_score != null) {
      updateData.safety_score = parseInt(updateData.safety_score);
    }

    // Check if license_number is unique if being updated
    if (updateData.license_number) {
      const existingDriver = await prisma.driver.findFirst({
        where: {
          license_number: { equals: updateData.license_number, mode: 'insensitive' },
          NOT: { id: parseInt(id) }
        }
      });
      if (existingDriver) {
        throw new AppError('License number already exists', 409, 'LICENSE_NUMBER_EXISTS');
      }
    }

    const driver = await prisma.driver.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    const driverWithExpiry = addIsLicenseExpiredToDriver(driver);

    res.status(200).json({
      success: true,
      data: driverWithExpiry
    });
  } catch (error) {
    next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.driver.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      data: { success: true }
    });
  } catch (error) {
    next(error);
  }
};

const suspendDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new AppError('Reason is required to suspend a driver', 400, 'MISSING_FIELDS');
    }

    const driver = await prisma.driver.update({
      where: { id: parseInt(id) },
      data: {
        status: 'suspended'
      }
    });

    const driverWithExpiry = addIsLicenseExpiredToDriver(driver);

    res.status(200).json({
      success: true,
      data: driverWithExpiry
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  suspendDriver
};
