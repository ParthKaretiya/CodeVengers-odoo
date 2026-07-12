import { useState, useCallback } from 'react';
import reportsService from '../services/reportsService';

const FETCHERS = {
  fuel_efficiency:  reportsService.getFuelEfficiency,
  utilization:      reportsService.getUtilization,
  operational_cost: reportsService.getOpsCost,
  roi:              reportsService.getRoi,
};

export function useReports(initialTab = 'fuel_efficiency') {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTab = useCallback(async (tab) => {
    const fetcher = FETCHERS[tab];
    if (!fetcher) return;
    try {
      setLoading(true);
      setError(null);
      setData([]);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    fetchTab(tab);
  };

  const exportCsv = () => {
    reportsService.exportCsv(activeTab, data);
  };

  return { activeTab, data, loading, error, switchTab, fetchTab, exportCsv };
}
