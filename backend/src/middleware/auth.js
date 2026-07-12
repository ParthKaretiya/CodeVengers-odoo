// Auth middleware skeleton - will be implemented in Module B.1
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

const authenticate = async (req, res, next) => {
  // TODO: Full implementation in Module B.1
  // For now, just pass through (skeleton)
  req.user = null; // Placeholder
  next();
};

module.exports = { authenticate };
