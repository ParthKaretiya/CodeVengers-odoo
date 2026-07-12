// RBAC middleware skeleton - will be implemented in Module B.1
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // TODO: Full implementation in Module B.1
    // For now, just pass through (skeleton)
    next();
  };
};

module.exports = { authorize };
