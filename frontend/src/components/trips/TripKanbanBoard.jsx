import TripCard from './TripCard';

const COLUMNS = [
  { id: 'draft', title: 'Draft', color: 'bg-slate-100', dot: 'bg-slate-400' },
  { id: 'dispatched', title: 'Dispatched', color: 'bg-blue-50', dot: 'bg-blue-500' },
  { id: 'completed', title: 'Completed', color: 'bg-emerald-50', dot: 'bg-emerald-500' },
  { id: 'cancelled', title: 'Cancelled', color: 'bg-slate-50', dot: 'bg-slate-300' },
];

export function TripKanbanSkeleton() {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {COLUMNS.map(col => (
        <div key={col.id} className={`flex-shrink-0 w-80 rounded-2xl border border-slate-200 p-4 ${col.color}`}>
           <div className="flex items-center gap-2 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
            <div className="h-5 w-24 bg-slate-200 rounded-md animate-pulse" />
          </div>
          <div className="space-y-3">
             {[1, 2].map(i => (
               <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />
             ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TripKanbanBoard({ 
  trips, 
  canAction, 
  onDispatch, 
  onComplete, 
  onCancel 
}) {
  
  // Group trips by status
  const grouped = trips.reduce((acc, trip) => {
    if (!acc[trip.status]) acc[trip.status] = [];
    acc[trip.status].push(trip);
    return acc;
  }, { draft: [], dispatched: [], completed: [], cancelled: [] });

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
      {COLUMNS.map(col => {
        const columnTrips = grouped[col.id] || [];
        return (
          <div key={col.id} className={`flex-shrink-0 w-80 lg:w-[calc(25%-18px)] min-w-[300px] flex flex-col rounded-2xl border border-slate-200 ${col.color} snap-center`}>
            
            {/* Column Header */}
            <div className="px-4 py-3.5 border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <h3 className="font-bold text-slate-800 tracking-tight">{col.title}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500">
                {columnTrips.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[500px]">
              {columnTrips.length === 0 ? (
                <div className="h-24 flex items-center justify-center text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200/60 rounded-xl">
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
