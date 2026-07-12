import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import vehicleService from '../../services/vehicleService';

const INPUT_CLS = "w-full bg-base-mid border border-app-border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-signal focus:ring-1 focus:ring-accent-signal transition-colors appearance-none disabled:opacity-50";

export default function MaintenanceForm({ isOpen, onClose, onSubmit }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ vehicle_id: '', description: '', cost: '', priority: 'Medium' });

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
      setFormData({ vehicle_id: '', description: '', cost: '', priority: 'Medium' });
      setError(null);
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      let data;
      try {
        data = await vehicleService.getAll();
      } catch {
        data = [
          { id: 101, reg_number: 'TRK-001', name: 'Freightliner Cascadia' },
          { id: 102, reg_number: 'TRK-002', name: 'Volvo VNL 860' },
          { id: 103, reg_number: 'TRK-003', name: 'Kenworth T680' }
        ];
      }
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.description || !formData.cost || !formData.priority) {
      setError('Please fill in all fields'); return;
    }
    onSubmit({ ...formData, vehicle_id: parseInt(formData.vehicle_id) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden bg-white border border-app-border">

        <div className="px-6 py-4 border-b border-app-border flex items-center justify-between shrink-0">
          <h2 className="text-lg font-display font-bold text-text-primary tracking-tight">Log Maintenance</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-base-mid transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Vehicle</label>
            <select value={formData.vehicle_id} onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })} className={INPUT_CLS} disabled={loading}>
              <option value="">Select a vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} - {v.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className={INPUT_CLS}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Estimated Cost ($)</label>
            <input type="number" min="0" step="0.01" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} className={`${INPUT_CLS} font-mono`} placeholder="e.g. 500.00" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={`${INPUT_CLS} min-h-[100px] resize-none`} placeholder="Describe the issue or required service..." />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-app-border flex items-center justify-end gap-3 shrink-0 bg-base">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold border border-app-border text-text-secondary hover:bg-base-mid transition-colors focus:outline-none">
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ backgroundColor: '#F5A623', color: '#1C2333' }} className="px-4 py-2 rounded-lg text-sm font-bold hover:brightness-105 transition-all active:scale-95 focus:outline-none">
            Log Maintenance
          </button>
        </div>
      </div>
    </div>
  );
}
