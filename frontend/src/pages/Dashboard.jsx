import { Car, Wrench, Map, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const stats = [
  { name: 'Active Vehicles', value: '42', icon: Car, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
  { name: 'Available for Dispatch', value: '18', icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  { name: 'In Maintenance', value: '4', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
  { name: 'Active Trips', value: '20', icon: Map, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  { name: 'Pending Trips (Draft)', value: '7', icon: Map, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  { name: 'Drivers On Duty', value: '20', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fleet Overview</h1>
          <p className="text-slate-500 mt-1">Real-time metrics and operations summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Live Sync</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={stat.name} 
            className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Background decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 transition-transform group-hover:scale-110 ${stat.bg}`}></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            
            <div className="mt-4 relative z-10">
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fleet Utilization Card (Large) */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Fleet Utilization</h2>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            {/* Placeholder for actual chart */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke="url(#gradient)" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="130" 
                  className="transition-all duration-1000 ease-out" 
                  strokeLinecap="round" 
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">48%</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Utilized</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-6 text-center max-w-sm">
              Currently using 20 out of 42 active vehicles. You have plenty of capacity for new trips today.
            </p>
          </div>
        </div>

        {/* Action Needed Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-800">Action Needed</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {/* Mock items */}
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <h4 className="text-sm font-semibold text-orange-800">Maintenance Overdue</h4>
              <p className="text-xs text-orange-600 mt-1">Vehicle V-104 needs an oil change.</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <h4 className="text-sm font-semibold text-red-800">Driver License Expiring</h4>
              <p className="text-xs text-red-600 mt-1">John Doe's license expires in 3 days.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <h4 className="text-sm font-semibold text-slate-700">Trip Delayed</h4>
              <p className="text-xs text-slate-500 mt-1">TRP-9021 is running 45m behind schedule.</p>
            </div>
          </div>
          
          <button className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
