import { useState, useEffect, useCallback } from 'react';
import driverService from '../services/driverService';

// ---------------------------------------------------------------------------
// Realistic mock drivers matching the hackathon demo script (4.txt).
// "Alex" is the primary driver referenced in the 9-step demo.
// isLicenseExpired is computed at read-time per spec (never stored).
// ---------------------------------------------------------------------------
const today = new Date();
const addDays = (d) => new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];

const MOCK_DRIVERS = [
  {
    id: 1, name: 'Alex Carter',    license_number: 'DL-TN-001-2021', license_category: 'HGV',
    license_expiry: addDays(180),  contact: '+91-98400-11111', safety_score: 92, status: 'available',
  },
  {
    id: 2, name: 'Priya Singh',    license_number: 'DL-TN-002-2019', license_category: 'LMV',
    license_expiry: addDays(20),   contact: '+91-98400-22222', safety_score: 78, status: 'available',
  },
  {
    id: 3, name: 'Ravi Kumar',     license_number: 'DL-TN-003-2022', license_category: 'HGV',
    license_expiry: addDays(-5),   contact: '+91-98400-33333', safety_score: 65, status: 'suspended',
  },
  {
    id: 4, name: 'Sara Mathews',   license_number: 'DL-TN-004-2023', license_category: 'LMV',
    license_expiry: addDays(300),  contact: '+91-98400-44444', safety_score: 88, status: 'on_trip',
  },
  {
    id: 5, name: 'David Nair',     license_number: 'DL-TN-005-2020', license_category: 'HGV',
    license_expiry: addDays(60),   contact: '+91-98400-55555', safety_score: 74, status: 'off_duty',
  },
  {
    id: 6, name: 'Meena Pillai',   license_number: 'DL-TN-006-2022', license_category: 'LMV',
    license_expiry: addDays(400),  contact: '+91-98400-66666', safety_score: 95, status: 'available',
  },
];

// Compute isLicenseExpired at read-time (per spec — never rely on stored field)
function enrichDriver(driver) {
  const expiry = new Date(driver.license_expiry);
  return { ...driver, isLicenseExpired: expiry < new Date() };
}

export function useDrivers(params = {}) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await driverService.getAll(params);
      const data = res.data ?? res;
      setDrivers(data.map(enrichDriver));
    } catch (err) {
      console.warn('[useDrivers] Backend unavailable, using mock data:', err.message);
      setDrivers(MOCK_DRIVERS.map(enrichDriver));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return { drivers, loading, error, refetch: fetchDrivers };
}
