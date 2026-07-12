const delay = (ms) => new Promise(res => setTimeout(res, ms));

const MOCK_FUEL = [
  { vehicle: 'TRK-001', name: 'Freightliner Cascadia', liters: 420, cost: 840, kmPerLiter: 4.2, trips: 12 },
  { vehicle: 'TRK-002', name: 'Volvo VNL 860',         liters: 380, cost: 760, kmPerLiter: 5.1, trips: 10 },
  { vehicle: 'TRK-003', name: 'Kenworth T680',         liters: 510, cost: 1020, kmPerLiter: 3.8, trips: 15 },
  { vehicle: 'TRK-004', name: 'Peterbilt 579',         liters: 290, cost: 580, kmPerLiter: 5.8, trips: 8  },
  { vehicle: 'TRK-005', name: 'Mack Anthem',           liters: 460, cost: 920, kmPerLiter: 4.0, trips: 13 },
];

const MOCK_UTILIZATION = [
  { vehicle: 'TRK-001', name: 'Freightliner Cascadia', totalDays: 30, activeDays: 24, utilization: 80 },
  { vehicle: 'TRK-002', name: 'Volvo VNL 860',         totalDays: 30, activeDays: 18, utilization: 60 },
  { vehicle: 'TRK-003', name: 'Kenworth T680',         totalDays: 30, activeDays: 28, utilization: 93 },
  { vehicle: 'TRK-004', name: 'Peterbilt 579',         totalDays: 30, activeDays: 12, utilization: 40 },
  { vehicle: 'TRK-005', name: 'Mack Anthem',           totalDays: 30, activeDays: 22, utilization: 73 },
];

const MOCK_OPS_COST = [
  { vehicle: 'TRK-001', name: 'Freightliner Cascadia', fuel: 840, maintenance: 450, other: 85, total: 1375 },
  { vehicle: 'TRK-002', name: 'Volvo VNL 860',         fuel: 760, maintenance: 150, other: 40, total: 950  },
  { vehicle: 'TRK-003', name: 'Kenworth T680',         fuel: 1020, maintenance: 320, other: 60, total: 1400 },
  { vehicle: 'TRK-004', name: 'Peterbilt 579',         fuel: 580, maintenance: 100, other: 30, total: 710  },
  { vehicle: 'TRK-005', name: 'Mack Anthem',           fuel: 920, maintenance: 200, other: 55, total: 1175 },
];

const MOCK_ROI = [
  { vehicle: 'TRK-001', name: 'Freightliner Cascadia', revenue: 4200, cost: 1375, profit: 2825, roi: 105 },
  { vehicle: 'TRK-002', name: 'Volvo VNL 860',         revenue: 3600, cost: 950,  profit: 2650, roi: 179 },
  { vehicle: 'TRK-003', name: 'Kenworth T680',         revenue: 5100, cost: 1400, profit: 3700, roi: 164 },
  { vehicle: 'TRK-004', name: 'Peterbilt 579',         revenue: 2800, cost: 710,  profit: 2090, roi: 194 },
  { vehicle: 'TRK-005', name: 'Mack Anthem',           revenue: 4600, cost: 1175, profit: 3425, roi: 192 },
];

const reportsService = {
  getFuelEfficiency: async () => { await delay(600); return [...MOCK_FUEL]; },
  getUtilization:    async () => { await delay(600); return [...MOCK_UTILIZATION]; },
  getOpsCost:        async () => { await delay(600); return [...MOCK_OPS_COST]; },
  getRoi:            async () => { await delay(600); return [...MOCK_ROI]; },

  // Trigger CSV export — generates a real CSV from mock data client-side
  exportCsv: (reportType, data) => {
    const CSV_HEADERS = {
      fuel_efficiency: ['Vehicle', 'Model', 'Liters', 'Cost ($)', 'km/L', 'Trips'],
      utilization:     ['Vehicle', 'Model', 'Active Days', 'Total Days', 'Utilization (%)'],
      operational_cost:['Vehicle', 'Model', 'Fuel ($)', 'Maintenance ($)', 'Other ($)', 'Total ($)'],
      roi:             ['Vehicle', 'Model', 'Revenue ($)', 'Cost ($)', 'Profit ($)', 'ROI (%)'],
    };

    const rows = {
      fuel_efficiency:  data.map(r => [r.vehicle, r.name, r.liters, r.cost, r.kmPerLiter, r.trips]),
      utilization:      data.map(r => [r.vehicle, r.name, r.activeDays, r.totalDays, r.utilization]),
      operational_cost: data.map(r => [r.vehicle, r.name, r.fuel, r.maintenance, r.other, r.total]),
      roi:              data.map(r => [r.vehicle, r.name, r.revenue, r.cost, r.profit, r.roi]),
    };

    const headers = CSV_HEADERS[reportType] || [];
    const csvRows = [headers, ...rows[reportType]];
    const csvContent = csvRows.map(r => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

export default reportsService;
