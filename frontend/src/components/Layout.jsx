import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_DETAILS } from '../constants/roles';

export default function Layout() {
  const { role, user } = useAuth();
  const location = useLocation();

  const roleInfo = ROLE_DETAILS?.[role] ?? {};
  const pathName = location.pathname.split('/')[1] || 'dashboard';
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1).replace(/-/g, ' ');

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: 'transparent' }}>
      {/* Sidebar — darkest layer, clear nav/workspace separation */}
      <Sidebar />

      {/* Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header — elevated surface, sits above cards */}
        <header
          style={{
            backgroundColor: '#16274A',
            borderBottom: '1px solid #22335A',
            boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
          }}
          className="h-16 px-8 flex items-center justify-between shrink-0"
        >
          <h2 className="text-base font-display font-semibold text-text-primary capitalize tracking-tight">
            {title}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary leading-none">{user?.name}</p>
              <p className="text-xs text-text-secondary mt-0.5 capitalize">{roleInfo?.title ?? role}</p>
            </div>
            {/* Avatar — amber accent */}
            <div
              style={{ backgroundColor: '#F5A623', color: '#0A1628' }}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page scroll area — transparent so body gradient shows */}
        <div className="flex-1 overflow-auto p-8" style={{ background: 'transparent' }}>
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
