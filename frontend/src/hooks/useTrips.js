import { useState, useEffect, useCallback } from 'react';
import tripService from '../services/tripService';
import { useVehicles } from './useVehicles';
import { useDrivers } from './useDrivers';

// ---------------------------------------------------------------------------
// Realistic mock trips matching the hackathon demo script (4.txt).
// Trip 1 is the one the user creates in the demo (Alex Carter + Van-05).
// ---------------------------------------------------------------------------
const MOCK_TRIPS = [
  {
    id: 1,
    source: 'Chennai Port',
    destination: 'Bangalore Hub',
    vehicle_id: 1, // Van-05
    driver_id: 1,  // Alex Carter
    cargo_weight: 450,
    planned_distance: 350,
    actual_distance: null,
    fuel_consumed: null,
    status: 'draft',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    source: 'Mumbai Warehouse',
    destination: 'Pune Distribution',
    vehicle_id: 2,
    driver_id: 4,
    cargo_weight: 1800,
    planned_distance: 150,
    actual_distance: null,
    fuel_consumed: null,
    status: 'dispatched',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    source: 'Delhi Hub',
    destination: 'Gurgaon Tech Park',
    vehicle_id: 5,
    driver_id: 6,
    cargo_weight: 300,
    planned_distance: 45,
    actual_distance: 48,
    fuel_consumed: 4.5,
    status: 'completed',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    source: 'Hyderabad Central',
    destination: 'Secunderabad Point',
    vehicle_id: 3,
    driver_id: 2,
    cargo_weight: 200,
    planned_distance: 25,
    actual_distance: null,
    fuel_consumed: null,
    status: 'cancelled',
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
];

export function useTrips(params = {}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We need vehicles and drivers to populate the relations in the UI
  // even if the backend isn't returning nested objects (it should, but safety first).
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripService.getAll(params);
      const data = res.data ?? res;
      setTrips(data);
    } catch (err) {
      console.warn('[useTrips] Backend unavailable, using mock data:', err.message);
      setTrips(MOCK_TRIPS);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Helper to get nested vehicle/driver details for a trip
  const enrichTrip = useCallback((trip) => {
    const vehicle = vehicles.find(v => v.id === trip.vehicle_id) || { name: 'Unknown', reg_number: 'N/A', max_capacity: 1000 };
    const driver = drivers.find(d => d.id === trip.driver_id) || { name: 'Unknown' };
    return { ...trip, vehicle, driver };
  }, [vehicles, drivers]);

  return { 
    trips: trips.map(enrichTrip), 
    loading, 
    error, 
    refetch: fetchTrips,
    dispatchTrip: tripService.dispatch,
    completeTrip: tripService.complete,
    cancelTrip: tripService.cancel
  };
}
