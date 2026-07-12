const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Mock memory store
const vehicleCosts = {
  101: { fuelTotal: 1200.50, maintenanceTotal: 450.00, expenseTotal: 85.00, operationalCost: 1735.50 },
  102: { fuelTotal: 800.00, maintenanceTotal: 150.00, expenseTotal: 40.00, operationalCost: 990.00 },
  103: { fuelTotal: 0, maintenanceTotal: 0, expenseTotal: 0, operationalCost: 0 }
};

const financeService = {
  getCosts: async (vehicleId) => {
    await delay(500);
    if (!vehicleId) return null;
    const costs = vehicleCosts[vehicleId] || { fuelTotal: 0, maintenanceTotal: 0, expenseTotal: 0, operationalCost: 0 };
    return { ...costs };
  },

  addFuelLog: async (data) => {
    await delay(600);
    const { vehicle_id, cost } = data;
    if (vehicleCosts[vehicle_id]) {
      vehicleCosts[vehicle_id].fuelTotal += parseFloat(cost);
      vehicleCosts[vehicle_id].operationalCost += parseFloat(cost);
    }
    return { id: Date.now(), ...data, created_at: new Date().toISOString() };
  },

  addExpense: async (data) => {
    await delay(600);
    const { vehicle_id, amount } = data;
    if (vehicleCosts[vehicle_id]) {
      vehicleCosts[vehicle_id].expenseTotal += parseFloat(amount);
      vehicleCosts[vehicle_id].operationalCost += parseFloat(amount);
    }
    return { id: Date.now(), ...data, created_at: new Date().toISOString() };
  }
};

export default financeService;
