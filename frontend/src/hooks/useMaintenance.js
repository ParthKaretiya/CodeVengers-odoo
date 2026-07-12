import { useState, useCallback, useEffect } from 'react';
import maintenanceService from '../services/maintenanceService';

export function useMaintenance() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await maintenanceService.getAll();
      setLogs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch maintenance logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLog = async (data) => {
    try {
      setError(null);
      const newLog = await maintenanceService.create(data);
      // Optimistically update
      setLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create maintenance log';
      setError(msg);
      throw new Error(msg);
    }
  };

  const closeLog = async (id, closingNotes) => {
    try {
      setError(null);
      const updatedLog = await maintenanceService.close(id, closingNotes);
      // Optimistically update
      setLogs(prev => prev.map(log => log.id === id ? updatedLog : log));
      return updatedLog;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to close maintenance log';
      setError(msg);
      throw new Error(msg);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
    createLog,
    closeLog
  };
}
