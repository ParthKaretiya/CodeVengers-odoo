import { useState, useCallback, useEffect } from 'react';
import dashboardService from '../services/dashboardService';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, overdueData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getOverdue()
      ]);

      setStats(statsData);
      setOverdue(overdueData.overdue);
      setUpcoming(overdueData.upcoming);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { stats, overdue, upcoming, loading, error, refetch: fetchAll };
}
