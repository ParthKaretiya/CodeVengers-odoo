import { useState } from 'react';

const INPUT_CLS = "w-full bg-base-mid border border-app-border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-signal focus:ring-1 focus:ring-accent-signal font-mono disabled:opacity-50";
const DATE_CLS = "w-full bg-base-mid border border-app-border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-signal focus:ring-1 focus:ring-accent-signal disabled:opacity-50";

export default function FuelLogForm({ onSubmit, loading, selectedVehicleId }) {
  const [formData, setFormData] = useState({
    liters: '', cost: '', date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) return;
    await onSubmit({ ...formData, vehicle_id: selectedVehicleId });
    setFormData(prev => ({ ...prev, liters: '', cost: '' }));
  };

  return (
    <div className="panel p-6 flex flex-col h-full">
      <div className="mb-6 border-b border-app-border pb-4">
        <h3 className="text-lg font-bold font-display text-text-primary">Add Fuel Log</h3>
        <p className="text-sm text-text-secondary mt-1">Record fuel consumption for the selected vehicle.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Liters</label>
          <input type="number" step="0.1" required value={formData.liters}
            onChange={e => setFormData({ ...formData, liters: e.target.value })}
            disabled={!selectedVehicleId || loading} className={INPUT_CLS} placeholder="e.g. 50.5" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Cost ($)</label>
          <input type="number" step="0.01" required value={formData.cost}
            onChange={e => setFormData({ ...formData, cost: e.target.value })}
            disabled={!selectedVehicleId || loading} className={INPUT_CLS} placeholder="e.g. 120.00" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Date</label>
          <input type="date" required value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            disabled={!selectedVehicleId || loading} className={DATE_CLS} />
        </div>

        <div className="mt-auto pt-6">
          <button type="submit" disabled={!selectedVehicleId || loading}
            style={{ backgroundColor: '#3B82F6', color: '#fff' }}
            className="w-full px-4 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-95 focus:outline-none disabled:opacity-50 disabled:pointer-events-none shadow-sm">
            {loading ? 'Submitting...' : 'Submit Fuel Log'}
          </button>
        </div>
      </form>
    </div>
  );
}
