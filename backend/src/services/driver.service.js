const isLicenseExpired = (licenseExpiryDate) => {
  const now = new Date();
  const expiryDate = new Date(licenseExpiryDate);
  return expiryDate < now;
};

const addIsLicenseExpiredToDriver = (driver) => {
  const driverObj = driver.toJSON ? driver.toJSON() : driver;
  return {
    ...driverObj,
    isLicenseExpired: isLicenseExpired(driverObj.license_expiry)
  };
};

module.exports = {
  isLicenseExpired,
  addIsLicenseExpiredToDriver
};
