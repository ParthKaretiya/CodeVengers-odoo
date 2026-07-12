import { useState, useCallback } from 'react';
import financeService from '../services/financeService';

export function useFinance() {
  const [costs, setCosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCosts = useCallback(async (vehicleId) => {
    if (!vehicleId) {
      setCosts(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getCosts(vehicleId);
      setCosts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch costs');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitFuelLog = async (data) => {
    try {
      setError(null);
      const res = await financeService.addFuelLog(data);
      // Immediately refetch costs if the submitted log matches the selected vehicle
      return res;
    } catch (err) {
      throw new Error(err.message || 'Failed to submit fuel log');
    }
  };

  const submitExpense = async (data) => {
    try {
      setError(null);
      const res = await financeService.addExpense(data);
      return res;
    } catch (err) {
      throw new Error(err.message || 'Failed to submit expense');
    }
  };

  return {
    costs,
    loading,
    error,
    fetchCosts,
    submitFuelLog,
    submitExpense
  };
}
