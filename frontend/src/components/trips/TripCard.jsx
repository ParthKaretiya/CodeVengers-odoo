import { User, Car, Box, Check, X, Navigation } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { getStatusColor } from '../../utils/statusColors';

/**
 * TripCard — the core Kanban tile.
 *
 * Color system:
 *  - Route dots + connecting line: inherit the card's status color
 *  - Progress bar fill: the status color
 *  - Dispatch button: --accent-primary amber (#F5A623), dark text
 *  - Complete button: --status-completed emerald (#10B981), white text
 *  - Cancel button: quiet ghost (secondary action)
 */
export default function TripCard({ trip, canAction, onDispatch, onComplete, onCancel }) {
  const { vehicle, driver } = trip;
  const statusHex = getStatusColor(trip.status);
  const capacityPct = vehicle?.max_capacity
    ? Math.min((trip.cargo_weight / vehicle.max_capacity) * 100, 100)
    : 0;

  // Parse hex → rgb for inline rgba usage
  const rr = parseInt(statusHex.slice(1, 3), 16);
  const gg = parseInt(statusHex.slice(3, 5), 16);
  const bb = parseInt(statusHex.slice(5, 7), 16);

  return (
    <div
      style={{ borderColor: `rgba(${rr},${gg},${bb},0.2)` }}
      className="panel p-4 flex flex-col gap-4 animate-in fade-in duration-300 w-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      {/* Top Row: Status Badge + Trip ID */}
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={trip.status} />
        <span className="text-[11px] font-mono font-medium text-text-secondary shrink-0">
          TRP-{String(trip.id).padStart(4, '0')}
        </span>
      </div>

      {/* Route — vertical with status-colored dots */}
      <div className="flex flex-col" style={{ gap: 0 }}>
        {/* Origin */}
        <div className="flex items-start gap-2.5">
          <div className="flex flex-col items-center" style={{ width: 8, marginTop: 5 }}>
            <span
              style={{ backgroundColor: statusHex, boxShadow: `0 0 6px rgba(${rr},${gg},${bb},0.6)` }}
              className="w-2 h-2 rounded-full shrink-0"
            />
            <span
              style={{ backgroundColor: `rgba(${rr},${gg},${bb},0.3)`, width: 1, height: 20 }}
            />
          </div>
          <span className="text-sm font-semibold text-text-primary leading-snug break-words flex-1 pb-1">
            {trip.source}
          </span>
        </div>
        {/* Destination */}
        <div className="flex items-start gap-2.5">
          <div style={{ width: 8, marginTop: 5 }}>
            <span
              style={{
                display: 'block',
                width: 8, height: 8,
                borderRadius: '50%',
                border: `2px solid ${statusHex}`,
                backgroundColor: '#121F38',
              }}
            />
          </div>
          <span className="text-sm font-semibold text-text-primary leading-snug break-words flex-1">
            {trip.destination}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div
        className="grid grid-cols-2 gap-y-3 gap-x-4 rounded-lg p-3 border border-app-border bg-base-mid"
      >
        {/* Vehicle */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Vehicle</span>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Car className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span className="text-xs font-mono font-semibold text-text-primary truncate">{vehicle?.name ?? '—'}</span>
          </div>
        </div>

        {/* Driver */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Driver</span>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <User className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span className="text-xs font-semibold text-text-primary truncate">{driver?.name ?? 'Unassigned'}</span>
          </div>
        </div>

        {/* Cargo progress bar */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
              <Box className="w-3 h-3" /> Cargo
            </span>
            <span className="text-[10px] font-mono font-bold text-text-primary">
              {trip.cargo_weight} / {vehicle?.max_capacity ?? 0} kg
            </span>
          </div>
          {/* Track */}
          <div style={{ backgroundColor: '#1E2330' }} className="h-1.5 w-full rounded-full overflow-hidden">
            {/* Fill — uses status color */}
            <div
              style={{
                width: `${capacityPct}%`,
                backgroundColor: statusHex,
                height: '100%',
                borderRadius: 9999,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {canAction && (
        <div className="flex items-center justify-end gap-2 pt-1">
          {trip.status === 'draft' && (
            <>
              {/* Cancel — quiet ghost */}
              <button
                onClick={() => onCancel(trip)}
                style={{ color: '#8B93A7', borderColor: '#1E2330' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-transparent hover:bg-surface-raised transition-colors focus:outline-none"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              {/* Dispatch — amber CTA */}
              <button
                onClick={() => onDispatch(trip)}
                style={{ backgroundColor: '#F5A623', color: '#0D0F14' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 transition-all active:scale-95 focus:outline-none"
              >
                <Navigation className="w-3.5 h-3.5" /> Dispatch
              </button>
            </>
          )}
          {trip.status === 'dispatched' && (
            <>
              {/* Cancel — ghost */}
              <button
                onClick={() => onCancel(trip)}
                style={{ color: '#8B93A7', borderColor: '#1E2330' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-transparent hover:bg-surface-raised transition-colors focus:outline-none"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              {/* Complete — emerald */}
              <button
                onClick={() => onComplete(trip)}
                style={{ backgroundColor: '#10B981', color: '#fff' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 transition-all active:scale-95 focus:outline-none"
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
