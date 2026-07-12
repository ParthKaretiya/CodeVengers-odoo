import { useState } from 'react';
import { Plus, RefreshCw, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useTrips } from '../hooks/useTrips';
import TripKanbanBoard, { TripKanbanSkeleton } from '../components/trips/TripKanbanBoard';
import TripForm from '../components/trips/TripForm';

export default function Trips() {
  const { role } = useAuth();
  const canAction = role === ROLES.MANAGER;

  const { trips, loading, error, refetch, dispatchTrip, completeTrip, cancelTrip } = useTrips();
  const [formOpen, setFormOpen] = useState(false);
  
  // Action Modals
  const [completingTrip, setCompletingTrip] = useState(null);
  const [actualDistance, setActualDistance] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleSuccess = (msg) => {
    toast.success(msg);
    refetch();
  };

  const handleDispatch = async (trip) => {
    try {
      await dispatchTrip(trip.id);
      toast.success('Trip dispatched successfully!');
      refetch();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to dispatch trip';
      toast.error(msg, { duration: 5000 }); // Show exact backend message per UX requirement
    }
  };

  const handleCancel = async (trip) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await cancelTrip(trip.id);
      toast.success('Trip cancelled.');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel trip');
    }
  };

  const submitComplete = async () => {
    if (!actualDistance || Number(actualDistance) <= 0) return toast.error('Enter valid actual distance');
    if (!fuelConsumed || Number(fuelConsumed) <= 0) return toast.error('Enter valid fuel consumed');
    
    setActionLoading(true);
    try {
      await completeTrip(completingTrip.id, { 
        actual_distance: Number(actualDistance), 
        fuel_consumed: Number(fuelConsumed) 
      });
      toast.success('Trip marked as completed!');
      setCompletingTrip(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete trip');
    } finally {
      setActionLoading(false);
    }
  };

  const openCompleteModal = (trip) => {
    setCompletingTrip(trip);
    setActualDistance(trip.planned_distance || '');
    setFuelConsumed('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trip Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading...' : `${trips.length} active and past trips`}
          </p>
        </div>
        {canAction && (
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Trip
          </button>
        )}
      </div>

      {/* Main Kanban Area */}
      {loading ? (
        <TripKanbanSkeleton />
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-red-100">
           <RefreshCw className="w-8 h-8 text-red-400 mb-4" />
           <p className="text-slate-700 font-semibold mb-2">Failed to load trips</p>
           <button onClick={refetch} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl">Retry</button>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <TripKanbanBoard 
            trips={trips} 
            canAction={canAction}
            onDispatch={handleDispatch}
            onComplete={openCompleteModal}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Creation Modal */}
      <TripForm isOpen={formOpen} onClose={() => setFormOpen(false)} onSuccess={handleSuccess} />

      {/* Complete Modal */}
      {completingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setCompletingTrip(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" /> Complete Trip
            </h3>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Actual Distance (km)</label>
                 <input type="number" value={actualDistance} onChange={e => setActualDistance(e.target.value)} className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-400" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Consumed (Liters)</label>
                 <input type="number" value={fuelConsumed} onChange={e => setFuelConsumed(e.target.value)} className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-400" />
               </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setCompletingTrip(null)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={submitComplete} disabled={actionLoading} className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
                {actionLoading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
