import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';
import { ROLES } from '../constants/roles';

// Amber brand accent
const ACCENT = '#F5A623';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = SIDEBAR_ITEMS[role] ?? [];
  const roleName = Object.keys(ROLES).find(k => ROLES[k] === role) ?? 'User';

  return (
    <aside
      style={{ backgroundColor: '#161A23', borderColor: '#262B38' }}
      className="w-64 flex flex-col shrink-0 border-r font-sans"
    >
      {/* Brand */}
      <div style={{ borderColor: '#262B38' }} className="h-16 px-6 flex items-center gap-3 border-b">
        <div
          style={{ backgroundColor: ACCENT, boxShadow: `0 0 14px rgba(245,166,35,0.35)` }}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        >
          <Car className="w-4 h-4 text-[#0D0F14]" />
        </div>
        <div>
          <p className="font-display font-bold text-base text-text-primary leading-none tracking-tight">TransitOps</p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mt-0.5">{roleName}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');

          return (
            <Link
              key={item.href}
              to={item.href}
              style={isActive ? {
                borderLeft: `3px solid ${ACCENT}`,
                color: ACCENT,
                backgroundColor: `rgba(245,166,35,0.08)`,
              } : {
                borderLeft: '3px solid transparent',
                color: '#8B93A7',
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm font-medium transition-all focus:outline-none hover:bg-surface-raised hover:text-text-primary"
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ borderColor: '#262B38' }} className="p-3 border-t">
        <button
          onClick={handleLogout}
          style={{ color: '#8B93A7' }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium hover:bg-surface-raised hover:text-red-400 transition-colors focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
