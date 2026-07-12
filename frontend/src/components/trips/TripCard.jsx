import { MapPin, ArrowRight, User, Car, Box, Check, X, Navigation } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function TripCard({ 
  trip, 
  canAction, 
  onDispatch, 
  onComplete, 
  onCancel 
}) {
  const { vehicle, driver } = trip;
  const capacityPct = vehicle?.max_capacity ? Math.min((trip.cargo_weight / vehicle.max_capacity) * 100, 100) : 0;
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* Header: Route + Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 flex items-center gap-2 text-sm font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate" title={trip.source}>{trip.source}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="truncate" title={trip.destination}>{trip.destination}</span>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {/* Vehicle */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</span>
          <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
            <Car className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{vehicle?.name || 'Unknown'} <span className="text-slate-400 font-normal">({vehicle?.reg_number || 'N/A'})</span></span>
          </div>
        </div>

        {/* Driver */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Driver</span>
          <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{driver?.name || 'Unassigned'}</span>
          </div>
        </div>

        {/* Cargo Progress */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
             <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
               <Box className="w-3.5 h-3.5" /> Cargo Weight
             </span>
             <span className="text-xs font-medium text-slate-600">
               {trip.cargo_weight} / {vehicle?.max_capacity || 0} kg
             </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div 
               className={`h-full rounded-full transition-all ${capacityPct > 90 ? 'bg-orange-500' : 'bg-blue-500'}`}
               style={{ width: `${capacityPct}%` }}
             />
          </div>
        </div>
      </div>

      {/* Actions (Only if canAction is true) */}
      {canAction && (
        <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-end gap-2">
          {trip.status === 'draft' && (
            <>
              <button 
                onClick={() => onCancel(trip)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button 
                onClick={() => onDispatch(trip)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" /> Dispatch
              </button>
            </>
          )}

          {trip.status === 'dispatched' && (
            <>
              <button 
                onClick={() => onCancel(trip)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button 
                onClick={() => onComplete(trip)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Complete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
