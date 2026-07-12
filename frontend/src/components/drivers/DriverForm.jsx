import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import driverService from '../../services/driverService';

const LICENSE_CATEGORIES = ['LMV', 'HGV', 'PSV', 'MCWG', 'Transport'];

const EMPTY_FORM = {
  name: '',
  license_number: '',
  license_category: '',
  license_expiry: '',
  contact: '',
  safety_score: '',
};

export default function DriverForm({ isOpen, onClose, driver, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!driver;

  useEffect(() => {
    if (isOpen) {
      setForm(driver ? {
        name:             driver.name ?? '',
        license_number:   driver.license_number ?? '',
        license_category: driver.license_category ?? '',
        license_expiry:   driver.license_expiry?.split('T')[0] ?? '',
        contact:          driver.contact ?? '',
        safety_score:     driver.safety_score ?? '',
      } : EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen, driver]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name             = 'Name is required';
    if (!form.license_number.trim())   e.license_number   = 'License number is required';
    if (!form.license_category)        e.license_category = 'Category is required';
    if (!form.license_expiry)          e.license_expiry   = 'Expiry date is required';
    if (!form.contact.trim())          e.contact          = 'Contact is required';
    if (form.safety_score === '' || Number(form.safety_score) < 0 || Number(form.safety_score) > 100)
      e.safety_score = 'Safety score must be 0–100';
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
      const payload = { ...form, safety_score: Number(form.safety_score) };
      if (isEditing) {
        await driverService.update(driver.id, payload);
        onSuccess('Driver updated successfully');
      } else {
        await driverService.create(payload);
        onSuccess('Driver registered successfully');
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message;
      setErrors({ form: msg || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Driver' : 'Register New Driver'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditing ? 'Update driver details below.' : 'Fill in the details to add a driver.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errors.form && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {errors.form}
            </div>
          )}

          <Field label="Full Name" error={errors.name}>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Alex Carter" className={inputCls(errors.name)} />
          </Field>

          <Field label="License Number" error={errors.license_number}>
            <input name="license_number" value={form.license_number} onChange={handleChange}
              placeholder="e.g. DL-TN-001-2021" className={inputCls(errors.license_number)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="License Category" error={errors.license_category}>
              <select name="license_category" value={form.license_category} onChange={handleChange}
                className={inputCls(errors.license_category)}>
                <option value="">Select…</option>
                {LICENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="License Expiry" error={errors.license_expiry}>
              <input name="license_expiry" type="date" value={form.license_expiry}
                onChange={handleChange} className={inputCls(errors.license_expiry)} />
            </Field>
          </div>

          <Field label="Contact Number" error={errors.contact}>
            <input name="contact" value={form.contact} onChange={handleChange}
              placeholder="+91-98400-11111" className={inputCls(errors.contact)} />
          </Field>

          <Field label="Safety Score (0–100)" error={errors.safety_score}>
            <input name="safety_score" type="number" min="0" max="100"
              value={form.safety_score} onChange={handleChange}
              placeholder="85" className={inputCls(errors.safety_score)} />
            {form.safety_score !== '' && (
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${Number(form.safety_score) >= 80 ? 'bg-emerald-500' : Number(form.safety_score) >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Number(form.safety_score), 100)}%` }}
                />
              </div>
            )}
          </Field>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
            {submitting
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : isEditing ? 'Save Changes' : 'Register Driver'}
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
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError) {
  return [
    'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all outline-none',
    hasError
      ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-300'
      : 'border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400',
  ].join(' ');
}
