import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_ITEMS } from '../constants/sidebarItems';

// Sidebar stays dark navy — deliberate Notion/Linear contrast pattern
const SIDEBAR_BG = '#1C2333';
const ACCENT = '#F5A623';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const navItems = SIDEBAR_ITEMS[role] ?? [];

  return (
    <aside
      style={{ backgroundColor: SIDEBAR_BG, borderRight: '1px solid rgba(255,255,255,0.08)' }}
      className="w-64 flex flex-col shrink-0 font-sans"
    >
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
                backgroundColor: 'rgba(245,166,35,0.12)',
              } : {
                borderLeft: '3px solid transparent',
                color: 'rgba(255,255,255,0.55)',
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm font-medium transition-all focus:outline-none hover:text-white hover:bg-white/10"
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="p-3">
        <button
          onClick={handleLogout}
          style={{ color: 'rgba(255,255,255,0.45)' }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium hover:bg-white/10 hover:text-red-400 transition-colors focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
