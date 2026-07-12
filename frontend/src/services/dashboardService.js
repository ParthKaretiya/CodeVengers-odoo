/**
 * Mock data for the Dashboard — mirrors what GET /dashboard would return.
 * Replace each function with a real API call when the backend is ready.
 */

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const MOCK_STATS = {
  totalVehicles: 48,
  activeTrips: 12,
  availableDrivers: 19,
  maintenanceAlerts: 4,
  completedTripsToday: 7,
  fuelSpendThisWeek: 3840,
  dispatchRate: 94, // %
};

const MOCK_OVERDUE = [
  { id: 1, type: 'maintenance', label: 'TRK-001 — Engine oil change', dueDate: '2026-07-08', status: 'overdue' },
  { id: 2, type: 'license', label: 'Driver D-104 — License expiry', dueDate: '2026-07-10', status: 'overdue' },
];

const MOCK_UPCOMING = [
  { id: 3, type: 'maintenance', label: 'TRK-002 — Brake pad replacement', dueDate: '2026-07-15', status: 'upcoming' },
  { id: 4, type: 'maintenance', label: 'TRK-005 — Tire rotation', dueDate: '2026-07-18', status: 'upcoming' },
  { id: 5, type: 'license', label: 'Driver D-201 — License renewal', dueDate: '2026-07-22', status: 'upcoming' },
];

const dashboardService = {
  getStats: async () => {
    await delay(700);
    return { ...MOCK_STATS };
  },

  getOverdue: async () => {
    await delay(500);
    return { overdue: [...MOCK_OVERDUE], upcoming: [...MOCK_UPCOMING] };
  }
};

export default dashboardService;
