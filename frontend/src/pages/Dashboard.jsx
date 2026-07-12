import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_DETAILS } from '../constants/roles';
import { Car, Wrench, Map, Users, TrendingUp, AlertTriangle, CheckSquare, Battery, PieChart, Activity, Bell } from 'lucide-react';

export default function Dashboard() {
  const { role, user } = useAuth();
  
  // Get role title for the banner
  const roleTitle = ROLE_DETAILS?.[role]?.title || 'Team Member';

  // Helper to render the Hero Banner
  const renderHero = (primaryStat, secondaryText) => (
    <div className="bg-hero-gradient rounded-2xl p-8 border border-app-border shadow-elevated mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-signal opacity-10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <span className="bg-accent-signal/20 text-accent-signal border border-accent-signal/30 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
            {roleTitle}
          </span>
        </div>
        <p className="text-text-secondary">{secondaryText}</p>
      </div>

      <div className="relative z-10 bg-surface-raised border border-app-border rounded-xl p-4 min-w-[200px] flex items-center justify-between shadow-card">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Live Status</p>
          <p className="font-mono text-xl font-bold text-text-primary">{primaryStat}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent-signal/10 flex items-center justify-center border border-accent-signal/20">
          <Activity className="w-5 h-5 text-accent-signal" />
        </div>
      </div>
    </div>
  );

  // ---------------- MANAGER DASHBOARD ----------------
  if (role === ROLES.MANAGER) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderHero('20 Active Trips', 'Fleet operations are running normally today.')}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard title="Active Vehicles" value="42" icon={Car} />
          <StatCard title="Active Trips" value="20" icon={Map} />
          <StatCard title="Maintenance Alerts" value="4" icon={Wrench} urgent={true} />
        </div>
        
        <div className="panel p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent-signal" /> Recent Activity
          </h2>
          <div className="bg-base-mid rounded-xl p-4 border border-app-border">
            <p className="text-text-secondary text-sm">Trip <span className="font-mono text-xs text-text-primary bg-surface-raised px-1.5 py-0.5 rounded border border-app-border">TRP-0104</span> dispatched successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DRIVER DASHBOARD ----------------
  if (role === ROLES.DRIVER) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderHero('TRP-0104', 'You have an active trip assigned for today.')}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard title="Assigned Vehicle" value="V-104" icon={Car} />
          <StatCard title="Today's Trip" value="TRP-0104" icon={Map} urgent={true} />
          <StatCard title="Fuel Status" value="75%" icon={Battery} />
          <StatCard title="Trip History" value="142" icon={Activity} />
        </div>
      </div>
    );
  }

  // ---------------- SAFETY CHECKER DASHBOARD ----------------
  if (role === ROLES.SAFETY) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderHero('8 Pending', 'Several vehicles require safety inspections before dispatch.')}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard title="Pending Inspections" value="8" icon={CheckSquare} urgent={true} />
          <StatCard title="Maintenance Queue" value="12" icon={Wrench} urgent={true} />
          <StatCard title="Safety Violations" value="0" icon={AlertTriangle} />
          <StatCard title="Vehicle Health" value="94%" icon={Activity} />
        </div>
      </div>
    );
  }

  // ---------------- ANALYST DASHBOARD ----------------
  if (role === ROLES.ANALYST) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderHero('$45.2k Rev', 'Revenue is up 12% compared to last week.')}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard title="Total Revenue" value="$45.2k" icon={TrendingUp} />
          <StatCard title="Fleet Cost" value="$12.4k" icon={PieChart} urgent={true} urgentColor="text-status-shop" urgentBg="bg-status-shop/10" urgentBorder="border-status-shop/30" />
          <StatCard title="Fuel Analytics" value="$3.2k" icon={Battery} />
        </div>
      </div>
    );
  }

  return null;
}

// Reusable KPI Widget with panel styling
function StatCard({ title, value, icon: Icon, urgent = false, urgentColor = 'text-status-shop', urgentBg = 'bg-status-shop/10', urgentBorder = 'border-status-shop/30' }) {
  const isUrgent = urgent && (Number(value) > 0 || value !== '0');
  
  const iconColor = isUrgent ? urgentColor : 'text-text-secondary';
  const iconBg = isUrgent ? urgentBg : 'bg-surface-raised';
  // If urgent, give it a slightly colored border, else use standard panel styling
  const panelClasses = isUrgent 
    ? `bg-surface rounded-2xl p-6 border ${urgentBorder} shadow-card-hover`
    : `panel p-6`;

  return (
    <div className={`${panelClasses} transition-all hover:-translate-y-0.5`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconBg} ${iconColor} border ${isUrgent ? urgentBorder : 'border-app-border'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-3xl font-mono font-bold text-text-primary tracking-tight mb-1">{value}</h3>
      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{title}</p>
    </div>
  );
}
