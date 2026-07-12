import { useNavigate } from 'react-router-dom';
import { Plus, Truck, Wrench } from 'lucide-react';

const ACTIONS = [
  {
    id: 'register-vehicle',
    label: 'Register Vehicle',
    icon: Truck,
    path: '/vehicles',
    accent: '#F5A623',
    description: 'Add a new vehicle to the fleet'
  },
  {
    id: 'create-trip',
    label: 'Create Trip',
    icon: Plus,
    path: '/trips',
    accent: '#3B82F6',
    description: 'Dispatch a new trip assignment'
  },
  {
    id: 'log-maintenance',
    label: 'Log Maintenance',
    icon: Wrench,
    path: '/maintenance',
    accent: '#10B981',
    description: 'Flag a vehicle for service'
  }
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="panel p-6">
      <h3 className="text-base font-bold font-display text-text-primary mb-5">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {ACTIONS.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={action.id}
              onClick={() => navigate(action.path)}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group text-left hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal"
              style={{
                backgroundColor: `${action.accent}10`,
                border: `1px solid ${action.accent}28`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${action.accent}20`, color: action.accent }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{action.label}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{action.description}</p>
              </div>
              <div className="ml-auto text-text-secondary group-hover:text-text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
