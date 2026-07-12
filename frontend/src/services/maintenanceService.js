// Mock data for maintenance logs
let mockLogs = [
  {
    id: 1,
    vehicle_id: 101,
    vehicle: { reg_number: 'TRK-001', name: 'Freightliner Cascadia', status: 'in_shop' },
    description: 'Engine oil leak detected during routine inspection. Needs gasket replacement.',
    cost: 450.00,
    priority: 'High',
    status: 'open',
    opened_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    vehicle_id: 102,
    vehicle: { reg_number: 'TRK-002', name: 'Volvo VNL 860', status: 'available' },
    description: 'Brake pads worn down to 15%. Scheduled for routine replacement.',
    cost: 150.00,
    priority: 'Medium',
    status: 'closed',
    opened_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    closed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    closing_notes: 'Replaced brake pads. Tested OK.'
  }
];

let nextId = 3;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const maintenanceService = {
  getAll: async () => {
    await delay(600);
    return [...mockLogs];
  },

  create: async (data) => {
    await delay(600);
    const newLog = {
      id: nextId++,
      vehicle_id: data.vehicle_id,
      vehicle: { 
        reg_number: `TRK-${String(data.vehicle_id).padStart(3, '0')}`, 
        name: 'Mock Vehicle', 
        status: 'in_shop' 
      },
      description: data.description,
      cost: data.cost,
      priority: data.priority,
      status: 'open',
      opened_at: new Date().toISOString()
    };
    mockLogs = [newLog, ...mockLogs];
    return newLog;
  },

  close: async (id, closingNotes) => {
    await delay(600);
    const logIndex = mockLogs.findIndex(l => l.id === id);
    if (logIndex === -1) throw new Error('Log not found');
    
    const updatedLog = {
      ...mockLogs[logIndex],
      status: 'closed',
      closed_at: new Date().toISOString(),
      closing_notes: closingNotes,
      vehicle: {
        ...mockLogs[logIndex].vehicle,
        status: 'available'
      }
    };
    mockLogs[logIndex] = updatedLog;
    return updatedLog;
  }
};

export default maintenanceService;
