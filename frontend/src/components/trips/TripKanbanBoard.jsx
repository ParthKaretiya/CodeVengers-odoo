import TripCard from './TripCard';

// Column definitions with exact status hex colors
const COLUMNS = [
  { id: 'draft',      title: 'Draft',      hex: '#8B93A7' },
  { id: 'dispatched', title: 'Dispatched', hex: '#3B82F6' },
  { id: 'completed',  title: 'Completed',  hex: '#10B981' },
  { id: 'cancelled',  title: 'Cancelled',  hex: '#F43F5E' },
];

export function TripKanbanSkeleton() {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4 h-full">
      {COLUMNS.map(col => {
        const r = parseInt(col.hex.slice(1,3),16);
        const g = parseInt(col.hex.slice(3,5),16);
        const b = parseInt(col.hex.slice(5,7),16);
        return (
          <div
            key={col.id}
            style={{ borderColor: '#262B38', minWidth: 300 }}
            className="flex-shrink-0 w-72 lg:flex-1 rounded-2xl border bg-surface flex flex-col"
          >
            <div style={{ borderColor: '#262B38' }} className="px-4 py-3.5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: col.hex, boxShadow: `0 0 6px rgba(${r},${g},${b},0.6)` }}
                  className="w-2 h-2 rounded-full"
                />
                <div className="h-4 w-20 bg-surface-raised rounded animate-pulse" />
              </div>
              <div className="h-5 w-6 bg-surface-raised rounded animate-pulse" />
            </div>
            <div className="p-3 space-y-3">
              {[1,2].map(i => (
                <div key={i} className="h-44 bg-surface-raised rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TripKanbanBoard({ trips, canAction, onDispatch, onComplete, onCancel }) {
  // Group trips by status client-side
  const grouped = trips.reduce((acc, trip) => {
    const key = trip.status;
    if (!acc[key]) acc[key] = [];
    acc[key].push(trip);
    return acc;
  }, { draft: [], dispatched: [], completed: [], cancelled: [] });

  return (
    <div className="flex gap-5 overflow-x-auto pb-4 h-full">
      {COLUMNS.map(col => {
        const columnTrips = grouped[col.id] ?? [];
        const r = parseInt(col.hex.slice(1,3),16);
        const g = parseInt(col.hex.slice(3,5),16);
        const b = parseInt(col.hex.slice(5,7),16);

        return (
          <div
            key={col.id}
            style={{ minWidth: 300 }}
            className="flex-shrink-0 w-72 lg:flex-1 flex flex-col panel overflow-hidden"
          >
            {/* Column header */}
            <div className="px-4 py-3.5 border-b border-app-border bg-base-mid/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Colored dot matching the status */}
                <span
                  style={{
                    backgroundColor: col.hex,
                    boxShadow: `0 0 8px rgba(${r},${g},${b},0.6)`,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                <h3 className="font-display font-bold text-text-primary text-sm tracking-tight">{col.title}</h3>
              </div>
              <span
                style={{ backgroundColor: '#13213D', color: '#8B9BB8' }}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-app-border"
              >
                {columnTrips.length}
              </span>
            </div>

            {/* Column body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[400px]">
              {columnTrips.length === 0 ? (
                <div
                  className="h-20 flex items-center justify-center text-sm font-medium border border-dashed border-app-border rounded-xl text-text-secondary"
                >
                  No trips
                </div>
              ) : (
                columnTrips.map(trip => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    canAction={canAction}
                    onDispatch={onDispatch}
                    onComplete={onComplete}
                    onCancel={onCancel}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
