import { useState } from 'react';
import { Plus, AlertCircle, Wrench, X } from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import MaintenanceList, { MaintenanceListSkeleton } from '../components/maintenance/MaintenanceList';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';
import vehicleService from '../services/vehicleService';

export default function MaintenancePage() {
  const { logs, loading, error, createLog, closeLog } = useMaintenance();
  const { role } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }

  // Only fleet manager or safety officer can log/close maintenance
  const canAction = role === ROLES.MANAGER || role === ROLES.SAFETY;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreate = async (data) => {
    try {
      const newLog = await createLog(data);
      setIsFormOpen(false);
      
      // The backend will have set the vehicle to 'in_shop'
      showToast(`Vehicle ${newLog.vehicle?.reg_number || data.vehicle_id} is now hidden from trip dispatch.`, 'success');
    } catch (err) {
      // Error is handled by hook, but we can also toast it
      showToast(err.message, 'error');
    }
  };

  const handleClose = async (log) => {
    const notes = window.prompt(`Enter closing notes for Maintenance Log on ${log.vehicle?.reg_number}:`);
    if (notes === null) return; // User cancelled

    try {
      await closeLog(log.id, notes);
      showToast(`Maintenance completed. Vehicle ${log.vehicle?.reg_number} is now available for dispatch.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-fraunces font-bold text-text-primary tracking-tight">Predictive <em style={{ fontStyle: 'italic', fontWeight: 600 }}>Maintenance</em></h1>
          <p className="text-text-secondary mt-1">Track and manage vehicle repairs and inspections.</p>
        </div>
        {canAction && (
          <button
            onClick={() => setIsFormOpen(true)}
            style={{ backgroundColor: '#F5A623', color: '#0A1628' }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold hover:brightness-110 transition-all active:scale-95 focus:outline-none shadow-lg shadow-accent-signal/20"
          >
            <Plus className="w-4 h-4" /> Log Maintenance
          </button>
        )}
      </div>

      {/* Global Toast Banner */}
      {toast && (
        <div className={`shrink-0 p-4 rounded-xl flex items-center justify-between border shadow-lg animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' 
            ? 'bg-status-available/10 border-status-available/20 text-status-available' 
            : 'bg-status-shop/10 border-status-shop/20 text-status-shop'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? <Wrench className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-black/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {error && !logs.length ? (
        <div className="panel p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-status-shop mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-text-primary mb-1">Failed to load</h3>
          <p className="text-text-secondary">{error}</p>
        </div>
      ) : loading ? (
        <MaintenanceListSkeleton />
      ) : (
        <MaintenanceList 
          logs={logs} 
          canAction={canAction} 
          onClose={handleClose} 
        />
      )}

      <MaintenanceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
