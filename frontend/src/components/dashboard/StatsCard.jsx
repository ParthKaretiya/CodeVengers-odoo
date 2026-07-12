/**
 * StatsCard — reusable KPI tile used 7× on the Dashboard.
 * Shows a skeleton when loading prop is true.
 */
export function StatsCardSkeleton() {
  return (
    <div className="panel p-6 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-base-mid mb-5" />
      <div className="h-8 w-20 bg-base-mid rounded-lg mb-2" />
      <div className="h-3 w-28 bg-base-mid rounded-lg" />
    </div>
  );
}

export default function StatsCard({ label, value, icon: Icon, accent, trend }) {
  const MAP = {
    amber:   { iconBg: 'rgba(245,166,35,0.12)',  iconColor: '#F5A623', border: 'rgba(245,166,35,0.25)'  },
    blue:    { iconBg: 'rgba(59,130,246,0.12)',  iconColor: '#3B82F6', border: 'rgba(59,130,246,0.25)'  },
    green:   { iconBg: 'rgba(16,185,129,0.12)',  iconColor: '#10B981', border: 'rgba(16,185,129,0.25)'  },
    red:     { iconBg: 'rgba(244,63,94,0.12)',   iconColor: '#F43F5E', border: 'rgba(244,63,94,0.25)'   },
    neutral: { iconBg: 'rgba(107,114,128,0.10)', iconColor: '#6B7280', border: '#E8E2D8'               },
  };

  const { iconBg, iconColor, border } = MAP[accent] ?? MAP.neutral;

  return (
    <div
      className="flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 group cursor-default bg-white"
      style={{
        border: `1px solid ${border}`,
        boxShadow: '0 1px 3px rgba(28,35,51,0.08), 0 1px 2px rgba(28,35,51,0.04)',
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>

      {/* Value */}
      <p className="text-3xl font-mono font-bold text-text-primary tracking-tight mb-1">{value}</p>

      {/* Label */}
      <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">{label}</p>

      {/* Optional trend badge */}
      {trend != null && (
        <div className="mt-3">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{
              color: trend >= 0 ? '#10B981' : '#F43F5E',
              backgroundColor: trend >= 0 ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)'
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last week
          </span>
        </div>
      )}
    </div>
  );
}
