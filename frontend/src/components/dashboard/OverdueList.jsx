import { Wrench, BadgeCheck, Clock, AlertTriangle } from 'lucide-react';

const TYPE_META = {
  maintenance: { icon: Wrench,       color: '#F5A623' },
  license:     { icon: BadgeCheck,   color: '#3B82F6' },
  inspection:  { icon: AlertTriangle, color: '#F43F5E' },
};

function OverdueItem({ item, isOverdue }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.maintenance;
  const Icon = meta.icon;
  const daysLabel = (() => {
    const diff = Math.round((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (isOverdue) return `${Math.abs(diff)}d overdue`;
    return `due in ${diff}d`;
  })();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-base-mid"
      style={{ borderLeft: `3px solid ${isOverdue ? '#F43F5E' : meta.color}` }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${isOverdue ? '#F43F5E' : meta.color}15` }}
      >
        <Icon className="w-4 h-4" style={{ color: isOverdue ? '#F43F5E' : meta.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{item.label}</p>
        <p className="text-[11px] text-text-secondary mt-0.5">{item.dueDate}</p>
      </div>
      <span
        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
        style={{
          color: isOverdue ? '#F43F5E' : meta.color,
          backgroundColor: isOverdue ? 'rgba(244,63,94,0.10)' : `${meta.color}18`
        }}
      >
        {daysLabel}
      </span>
    </div>
  );
}

export default function OverdueList({ overdue = [], upcoming = [] }) {
  const isEmpty = overdue.length === 0 && upcoming.length === 0;

  if (isEmpty) {
    return (
      <div className="panel p-6 flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(16,185,129,0.10)' }}>
          <BadgeCheck className="w-6 h-6" style={{ color: '#10B981' }} />
        </div>
        <p className="text-sm font-bold text-text-primary">All clear!</p>
        <p className="text-xs text-text-secondary mt-1">No overdue or upcoming items.</p>
      </div>
    );
  }

  return (
    <div className="panel p-6 space-y-6">
      <h3 className="text-base font-bold font-display text-text-primary flex items-center gap-2">
        <Clock className="w-4 h-4 text-text-secondary" />
        Schedule &amp; Alerts
      </h3>

      {overdue.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#F43F5E' }}>
            ● Overdue ({overdue.length})
          </p>
          <div className="space-y-1.5">
            {overdue.map(item => <OverdueItem key={item.id} item={item} isOverdue />)}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            ○ Upcoming ({upcoming.length})
          </p>
          <div className="space-y-1.5">
            {upcoming.map(item => <OverdueItem key={item.id} item={item} isOverdue={false} />)}
          </div>
        </div>
      )}
    </div>
  );
}
