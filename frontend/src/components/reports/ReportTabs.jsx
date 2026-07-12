import { ROLES } from '../../constants/roles';

// Tabs available per role
const ALL_TABS = [
  {
    id: 'fuel_efficiency',
    label: 'Fuel Efficiency',
    roles: [ROLES.MANAGER, ROLES.SAFETY, ROLES.ANALYST, ROLES.DRIVER],
  },
  {
    id: 'utilization',
    label: 'Utilization',
    roles: [ROLES.MANAGER, ROLES.SAFETY, ROLES.ANALYST, ROLES.DRIVER],
  },
  {
    id: 'operational_cost',
    label: 'Operational Cost',
    roles: [ROLES.ANALYST, ROLES.MANAGER], // financial analyst + manager only
  },
  {
    id: 'roi',
    label: 'ROI',
    roles: [ROLES.ANALYST],  // financial analyst only
  },
];

export default function ReportTabs({ activeTab, onSwitch, role }) {
  const visibleTabs = ALL_TABS.filter(t => t.roles.includes(role));

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl shrink-0"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', boxShadow: '0 1px 3px rgba(28,35,51,0.06)' }}
    >
      {visibleTabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            id={`report-tab-${tab.id}`}
            onClick={() => onSwitch(tab.id)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal whitespace-nowrap"
            style={isActive ? {
              backgroundColor: '#FAF7F2',
              color: '#B87A0A',
              boxShadow: '0 1px 3px rgba(28,35,51,0.06)',
              border: '1px solid rgba(245,166,35,0.25)',
            } : {
              color: '#6B7280',
              border: '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
