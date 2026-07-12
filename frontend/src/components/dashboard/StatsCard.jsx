import { useCountUp } from '../../hooks/useCountUp';

export function StatsCardSkeleton() {
  return (
    <div className="panel p-6 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-base-mid mb-5" />
      <div className="h-8 w-20 bg-base-mid rounded-lg mb-2" />
      <div className="h-3 w-28 bg-base-mid rounded-lg" />
    </div>
  );
}

// Inner component that receives already-parsed numeric target
function CountUpValue({ raw, fmt }) {
  // Parse numeric part from formatted value (e.g. "$3,840" → 3840, "94%" → 94)
  const stripped = String(raw).replace(/[^0-9.]/g, '');
  const num = parseFloat(stripped);
  const counted = useCountUp(isNaN(num) ? 0 : num, 500);

  if (fmt === 'currency') return `$${counted.toLocaleString()}`;
  if (fmt === 'pct') return `${counted}%`;
  return String(counted);
}

export default function StatsCard({ label, value, icon: Icon, accent, fmt }) {
  const MAP = {
    amber:   { iconBg: 'rgba(245,166,35,0.12)',  iconColor: '#F5A623', border: 'rgba(245,166,35,0.25)'  },
    blue:    { iconBg: 'rgba(59,130,246,0.12)',  iconColor: '#3B82F6', border: 'rgba(59,130,246,0.25)'  },
    green:   { iconBg: 'rgba(16,185,129,0.12)',  iconColor: '#10B981', border: 'rgba(16,185,129,0.25)'  },
    red:     { iconBg: 'rgba(244,63,94,0.12)',   iconColor: '#F43F5E', border: 'rgba(244,63,94,0.25)'   },
    neutral: { iconBg: 'rgba(107,114,128,0.10)', iconColor: '#6B7280', border: '#E8E2D8'               },
  };

  const { iconBg, iconColor, border } = MAP[accent] ?? MAP.neutral;

  // Detect whether this value is numeric (suitable for count-up)
  const stripped = String(value).replace(/[^0-9.]/g, '');
  const isNumeric = stripped !== '' && !isNaN(parseFloat(stripped));

  return (
    <div
      className="flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 group cursor-default bg-white content-reveal"
      style={{
        border: `1px solid ${border}`,
        boxShadow: '0 1px 3px rgba(28,35,51,0.08), 0 1px 2px rgba(28,35,51,0.04)',
      }}
    >
      {/* Icon chip */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>

      {/* Value — count-up if numeric, static otherwise */}
      <p className="text-3xl font-mono font-bold text-text-primary tracking-tight mb-1">
        {isNumeric
          ? <CountUpValue raw={stripped} fmt={fmt} />
          : value
        }
      </p>

      {/* Label */}
      <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">{label}</p>
    </div>
  );
}
