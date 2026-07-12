import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../services/vehicleService';

// ---------------------------------------------------------------------------
// Realistic seed data (used when backend is not yet running).
// Matches the demo script from the hackathon playbook.
// ---------------------------------------------------------------------------
const MOCK_VEHICLES = [
  { id: 1, reg_number: 'TN-01-VN-0005', name: 'Van-05',    type: 'Van',   max_capacity: 500, odometer: 12400, acquisition_cost: 28000, status: 'available' },
  { id: 2, reg_number: 'TN-01-TR-0012', name: 'Truck-12',  type: 'Truck', max_capacity: 2000, odometer: 54200, acquisition_cost: 75000, status: 'on_trip'   },
  { id: 3, reg_number: 'TN-01-VN-0008', name: 'Van-08',    type: 'Van',   max_capacity: 600, odometer: 8900,  acquisition_cost: 30000, status: 'in_shop'   },
  { id: 4, reg_number: 'TN-01-TR-0003', name: 'Truck-03',  type: 'Truck', max_capacity: 3000, odometer: 98700, acquisition_cost: 90000, status: 'available' },
  { id: 5, reg_number: 'TN-01-SU-0021', name: 'SUV-21',    type: 'SUV',   max_capacity: 400, odometer: 23100, acquisition_cost: 45000, status: 'available' },
  { id: 6, reg_number: 'TN-01-BU-0002', name: 'Bus-02',    type: 'Bus',   max_capacity: 5000, odometer: 142000, acquisition_cost: 120000, status: 'retired' },
  { id: 7, reg_number: 'TN-01-PK-0007', name: 'Pickup-07', type: 'Pickup', max_capacity: 800, odometer: 31500, acquisition_cost: 32000, status: 'on_trip' },
];

export function useVehicles(params = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehicleService.getAll(params);
      setVehicles(res.data ?? res);
    } catch (err) {
      // Backend not running — fall back to mock data for UI preview
      console.warn('[useVehicles] Backend unavailable, using mock data:', err.message);
      setVehicles(MOCK_VEHICLES);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}
