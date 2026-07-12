import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { ROLE_DETAILS } from '../constants/roles';
import StatsCard, { StatsCardSkeleton } from '../components/dashboard/StatsCard';
import OverdueList from '../components/dashboard/OverdueList';
import QuickActions from '../components/dashboard/QuickActions';
import {
  Car, Map, Users, Wrench, CheckCircle, Fuel, Gauge, Activity
} from 'lucide-react';

const STAT_DEFS = [
  { key: 'totalVehicles',      label: 'Total Vehicles',     icon: Car,         accent: 'blue'    },
  { key: 'activeTrips',        label: 'Active Trips',       icon: Map,         accent: 'amber'   },
  { key: 'availableDrivers',   label: 'Available Drivers',  icon: Users,       accent: 'green'   },
  { key: 'maintenanceAlerts',  label: 'Maint. Alerts',      icon: Wrench,      accent: 'red'     },
  { key: 'completedTripsToday',label: 'Trips Today',        icon: CheckCircle, accent: 'green'   },
  { key: 'fuelSpendThisWeek',  label: 'Fuel Spend (7d)',    icon: Fuel,        accent: 'neutral', format: 'currency' },
  { key: 'dispatchRate',       label: 'Dispatch Rate',      icon: Gauge,       accent: 'blue',   format: 'pct'      },
];

function formatValue(raw, fmt) {
  if (raw == null) return '—';
  if (fmt === 'currency') return `$${Number(raw).toLocaleString()}`;
  if (fmt === 'pct') return `${raw}%`;
  return String(raw);
}

export default function Dashboard() {
  const { role, user } = useAuth();
  const { stats, overdue, upcoming, loading } = useDashboard();
  const roleInfo = ROLE_DETAILS?.[role] ?? {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Hero Banner — soft amber-cream wash, echoes brand amber */}
      <div
        className="rounded-2xl p-8 border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, #FFF8ED 0%, #FDEDD3 100%)',
          border: '1px solid #F0DDB8',
          boxShadow: '0 1px 3px rgba(28,35,51,0.06)',
        }}
      >
        {/* Ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(245,166,35,0.12)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-3xl font-fraunces font-bold text-text-primary tracking-tight">
              Welcome back,{' '}
              <em className="not-italic" style={{ fontStyle: 'italic', color: '#F5A623', fontWeight: 600 }}>
                {user?.name?.split(' ')[0] || 'User'}!
              </em>
            </h1>
            <span
              className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border"
              style={{ color: '#B87A0A', backgroundColor: 'rgba(245,166,35,0.15)', borderColor: 'rgba(245,166,35,0.35)' }}
            >
              {roleInfo?.title ?? role}
            </span>
          </div>
        </div>

        {/* Live Status pill */}
        <div
          className="relative z-10 rounded-2xl p-4 min-w-[180px] flex items-center justify-between gap-4 shrink-0"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E2D8',
            boxShadow: '0 1px 3px rgba(28,35,51,0.08)',
          }}
        >
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Active Trips</p>
            <p className="font-mono text-2xl font-bold text-text-primary">
              {loading ? '—' : stats?.activeTrips ?? '—'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)' }}>
            <Activity className="w-5 h-5" style={{ color: '#F5A623' }} />
          </div>
        </div>
      </div>

      {/* 7 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <StatsCardSkeleton key={i} />)
          : STAT_DEFS.map(def => (
              <StatsCard
                key={def.key}
                label={def.label}
                value={formatValue(stats?.[def.key], def.format)}
                icon={def.icon}
                accent={def.accent}
                fmt={def.format}
              />
            ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverdueList overdue={overdue} upcoming={upcoming} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
