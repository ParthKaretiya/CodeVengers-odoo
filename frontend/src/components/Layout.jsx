import { Outlet, useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS, ROLES } from '../constants/roles';

export default function Layout() {
  const { role, user } = useAuth();
  const location = useLocation();

  const roleInfo = ROLE_DETAILS?.[role] ?? {};
  const pathName = location.pathname.split('/')[1] || 'dashboard';
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1).replace(/-/g, ' ');

  const ACCENT = '#F5A623';
  const roleName = Object.keys(ROLES).find(k => ROLES[k] === role) ?? 'User';

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans" style={{ background: 'transparent' }}>
      {/* Global Header — white elevated surface, full width */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E2D8',
          boxShadow: '0 1px 3px rgba(28,35,51,0.07)',
        }}
        className="h-16 flex items-center shrink-0 z-10"
      >
        {/* Left: Brand — same width as sidebar */}
        <div
          style={{ borderRight: '1px solid #E8E2D8', backgroundColor: '#1C2333' }}
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
            <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{roleName}</p>
          </div>
        </div>

        {/* Right: Page Title & User Info */}
        <div className="flex-1 px-8 flex items-center justify-between">
          <h2 className="text-base font-display font-semibold text-text-primary capitalize tracking-tight">
            {title}
          </h2>
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

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8" style={{ background: 'transparent' }}>
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
