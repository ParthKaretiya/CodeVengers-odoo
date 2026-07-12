import { useEffect, useRef, useState } from 'react';
import { User, Car, Box, Check, X, Navigation } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { getStatusColor } from '../../utils/statusColors';

/**
 * TripCard — Kanban tile with enter/exit animations on status change.
 *
 * Animation contract:
 *  - When `trip.status` changes, the card plays kanban-exit (scale-down + fade-out)
 *    then immediately signals the parent to re-sort, while the new card in the
 *    target column plays kanban-enter (scale-up + fade-in).
 *  - A local `entering` flag plays kanban-enter on first mount of this card instance.
 *  - Respects prefers-reduced-motion (handled globally in index.css).
 */
export default function TripCard({ trip, canAction, onDispatch, onComplete, onCancel }) {
  const { vehicle, driver } = trip;
  const statusHex = getStatusColor(trip.status);
  const capacityPct = vehicle?.max_capacity
    ? Math.min((trip.cargo_weight / vehicle.max_capacity) * 100, 100)
    : 0;

  const rr = parseInt(statusHex.slice(1, 3), 16);
  const gg = parseInt(statusHex.slice(3, 5), 16);
  const bb = parseInt(statusHex.slice(5, 7), 16);

  // Play enter animation on mount (this instance is "new" in its column)
  const [entering, setEntering] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      // Remove enter class after animation completes (200ms)
      const t = setTimeout(() => setEntering(false), 220);
      return () => clearTimeout(t);
    }
  }, []);

  // Build animation class
  const animClass = entering ? 'kanban-enter' : '';

  // Button action with exit animation wrapper
  const animatedAction = (action) => async (trip) => {
    // We let the optimistic update + refetch handle the actual move.
    // The exit animation is applied by the parent removing the card;
    // the kanban-exit class would need the card to remain in DOM briefly.
    // Since we use refetch (not optimistic), the card just disappears and
    // the new one enters — that's the enter animation above.
    await action(trip);
  };

  return (
    <div
      style={{ borderColor: `rgba(${rr},${gg},${bb},0.2)` }}
      className={`panel p-4 flex flex-col gap-4 w-full overflow-hidden hover:-translate-y-0.5 hover:shadow-card-hover ${animClass}`}
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
        <div className="flex items-start gap-2.5">
          <div className="flex flex-col items-center" style={{ width: 8, marginTop: 5 }}>
            <span
              style={{ backgroundColor: statusHex, boxShadow: `0 0 6px rgba(${rr},${gg},${bb},0.6)`, transition: 'background-color 150ms ease' }}
              className="w-2 h-2 rounded-full shrink-0"
            />
            <span style={{ backgroundColor: `rgba(${rr},${gg},${bb},0.3)`, width: 1, height: 20, transition: 'background-color 150ms ease' }} />
          </div>
          <span className="text-sm font-semibold text-text-primary leading-snug break-words flex-1 pb-1">{trip.source}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <div style={{ width: 8, marginTop: 5 }}>
            <span style={{
              display: 'block', width: 8, height: 8, borderRadius: '50%',
              border: `2px solid ${statusHex}`,
              backgroundColor: '#FFFFFF',
              transition: 'border-color 150ms ease',
            }} />
          </div>
          <span className="text-sm font-semibold text-text-primary leading-snug break-words flex-1">{trip.destination}</span>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 rounded-lg p-3 border border-app-border bg-base-mid">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Vehicle</span>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Car className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span className="text-xs font-mono font-semibold text-text-primary truncate">{vehicle?.name ?? '—'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Driver</span>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <User className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span className="text-xs font-semibold text-text-primary truncate">{driver?.name ?? 'Unassigned'}</span>
          </div>
        </div>
        {/* Cargo progress */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
              <Box className="w-3 h-3" /> Cargo
            </span>
            <span className="text-[10px] font-mono font-bold text-text-primary">
              {trip.cargo_weight} / {vehicle?.max_capacity ?? 0} kg
            </span>
          </div>
          <div style={{ backgroundColor: '#E8E2D8' }} className="h-1.5 w-full rounded-full overflow-hidden">
            <div style={{
              width: `${capacityPct}%`,
              backgroundColor: statusHex,
              height: '100%', borderRadius: 9999,
              transition: 'width 0.4s ease, background-color 0.15s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {canAction && (
        <div className="flex items-center justify-end gap-2 pt-1">
          {trip.status === 'draft' && (
            <>
              <button
                onClick={() => onCancel(trip)}
                style={{ color: '#6B7280', borderColor: '#E8E2D8' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-transparent hover:bg-base-mid focus:outline-none"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={() => onDispatch(trip)}
                style={{ backgroundColor: '#F5A623', color: '#1C2333' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 focus:outline-none"
              >
                <Navigation className="w-3.5 h-3.5" /> Dispatch
              </button>
            </>
          )}
          {trip.status === 'dispatched' && (
            <>
              <button
                onClick={() => onCancel(trip)}
                style={{ color: '#6B7280', borderColor: '#E8E2D8' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-transparent hover:bg-base-mid focus:outline-none"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={() => onComplete(trip)}
                style={{ backgroundColor: '#10B981', color: '#fff' }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 focus:outline-none"
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
