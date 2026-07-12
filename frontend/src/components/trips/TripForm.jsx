import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { useDrivers } from '../../hooks/useDrivers';
import tripService from '../../services/tripService';

const EMPTY_FORM = {
  source: '',
  destination: '',
  vehicle_id: '',
  driver_id: '',
  cargo_weight: '',
  planned_distance: '',
};

export default function TripForm({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch only available vehicles and drivers for the form
  const { vehicles } = useVehicles();
  const { drivers } = useDrivers();
  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const availableDrivers = drivers.filter(d => d.status === 'available' && !d.isLicenseExpired);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.source.trim()) e.source = 'Source is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.vehicle_id) e.vehicle_id = 'Vehicle is required';
    if (!form.driver_id) e.driver_id = 'Driver is required';
    if (!form.cargo_weight || Number(form.cargo_weight) <= 0) e.cargo_weight = 'Valid cargo weight required';
    if (!form.planned_distance || Number(form.planned_distance) <= 0) e.planned_distance = 'Valid distance required';

    // Client-side pre-check for capacity
    if (form.vehicle_id && form.cargo_weight) {
      const selectedVehicle = availableVehicles.find(v => v.id === Number(form.vehicle_id));
      if (selectedVehicle && Number(form.cargo_weight) > selectedVehicle.max_capacity) {
        e.cargo_weight = `Exceeds max capacity (${selectedVehicle.max_capacity} kg)`;
      }
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        vehicle_id: Number(form.vehicle_id),
        driver_id: Number(form.driver_id),
        cargo_weight: Number(form.cargo_weight),
        planned_distance: Number(form.planned_distance),
      };
      await tripService.create(payload);
      onSuccess('Trip created successfully as Draft');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create trip.';
      // Specifically show exact backend 422 messages here
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Trip</h2>
            <p className="text-sm text-slate-500 mt-0.5">Draft a new trip and assign resources.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && (
             <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
               <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {errors.form}
             </div>
          )}

          <Field label="Source" error={errors.source}>
            <input name="source" value={form.source} onChange={handleChange} placeholder="e.g. Chennai Port" className={inputCls(errors.source)} />
          </Field>
          <Field label="Destination" error={errors.destination}>
            <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Bangalore Hub" className={inputCls(errors.destination)} />
          </Field>

          <Field label="Assign Vehicle" error={errors.vehicle_id}>
             <select name="vehicle_id" value={form.vehicle_id} onChange={handleChange} className={inputCls(errors.vehicle_id)}>
               <option value="">Select available vehicle...</option>
               {availableVehicles.map(v => (
                 <option key={v.id} value={v.id}>{v.name} ({v.type} - Max: {v.max_capacity}kg)</option>
               ))}
             </select>
          </Field>
          
          <Field label="Assign Driver" error={errors.driver_id}>
             <select name="driver_id" value={form.driver_id} onChange={handleChange} className={inputCls(errors.driver_id)}>
               <option value="">Select available driver...</option>
               {availableDrivers.map(d => (
                 <option key={d.id} value={d.id}>{d.name} (License: {d.license_category})</option>
               ))}
             </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
             <Field label="Cargo Weight (kg)" error={errors.cargo_weight}>
               <input name="cargo_weight" type="number" min="1" value={form.cargo_weight} onChange={handleChange} placeholder="500" className={inputCls(errors.cargo_weight)} />
             </Field>
             <Field label="Planned Dist. (km)" error={errors.planned_distance}>
               <input name="planned_distance" type="number" min="1" value={form.planned_distance} onChange={handleChange} placeholder="150" className={inputCls(errors.planned_distance)} />
             </Field>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
            {submitting ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="flex items-center gap-1.5 text-xs text-red-600"><AlertCircle className="w-3.5 h-3.5" /> {error}</p>}
    </div>
  );
}

function inputCls(hasError) {
  return `w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all outline-none ${hasError ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-300' : 'border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'}`;
}
