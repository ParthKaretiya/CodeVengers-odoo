import { Outlet, useLocation } from 'react-router-dom';
import { Car, LayoutDashboard, Truck, Users, Map, Wrench, DollarSign, BarChart2, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS, ROLES } from '../constants/roles';

// Map each route segment → { label, Icon }
const PAGE_META = {
  dashboard:   { label: 'Dashboard',   Icon: LayoutDashboard },
  vehicles:    { label: 'Vehicles',    Icon: Truck           },
  drivers:     { label: 'Drivers',     Icon: Users           },
  trips:       { label: 'Trips',       Icon: Map             },
  maintenance: { label: 'Maintenance', Icon: Wrench          },
  finance:     { label: 'Finance',     Icon: DollarSign      },
  reports:     { label: 'Reports',     Icon: BarChart2       },
  settings:    { label: 'Settings',    Icon: Settings        },
};

export default function Layout() {
  const { role, user } = useAuth();
  const location = useLocation();

  const roleInfo = ROLE_DETAILS?.[role] ?? {};
  const segment = location.pathname.split('/')[1] || 'dashboard';
  const meta = PAGE_META[segment] ?? { label: segment.charAt(0).toUpperCase() + segment.slice(1), Icon: LayoutDashboard };
  const PageIcon = meta.Icon;

  const ACCENT   = '#F5A623';
  const roleName = Object.keys(ROLES).find(k => ROLES[k] === role) ?? 'User';

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans" style={{ background: 'transparent' }}>

      {/* ── Global Header ── */}
      <header
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E2D8', boxShadow: '0 1px 3px rgba(28,35,51,0.07)' }}
        className="h-16 flex items-center shrink-0 z-10"
      >
        {/* Brand — dark navy section, same width as sidebar */}
        <div
          style={{ borderRight: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1C2333' }}
          className="w-64 h-full px-6 flex items-center gap-3 shrink-0"
        >
          <div
            style={{ backgroundColor: ACCENT, boxShadow: `0 0 14px rgba(245,166,35,0.35)` }}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          >
            <Car className="w-4 h-4 text-[#1C2333]" />
          </div>
          <div>
            <p className="font-display font-bold text-base leading-none tracking-tight" style={{ color: '#FFFFFF' }}>TransitOps</p>
            <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{roleName}</p>
          </div>
        </div>

        {/* Page context + User info */}
        <div className="flex-1 px-8 flex items-center justify-between">

          {/* ── Page title with icon chip ── */}
          <div className="flex items-center gap-3">
            {/* Icon chip */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(245,166,35,0.10)', border: '1px solid rgba(245,166,35,0.20)' }}
            >
              <PageIcon className="w-4 h-4" style={{ color: ACCENT }} />
            </div>

            {/* Page title */}
            <span className="font-fraunces font-bold text-[1.1rem] tracking-tight" style={{ color: '#1C2333' }}>
              {meta.label}
            </span>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary leading-none">{user?.name}</p>
              <p className="text-xs text-text-secondary mt-0.5 capitalize">{roleInfo?.title ?? role}</p>
            </div>
            <div
              style={{ backgroundColor: ACCENT, color: '#1C2333' }}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content — page-enter fade on route change ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8" style={{ background: 'transparent' }}>
          <div key={location.pathname} className="max-w-7xl mx-auto h-full page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
