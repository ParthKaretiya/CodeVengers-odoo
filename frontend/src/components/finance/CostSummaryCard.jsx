import { DollarSign, Droplet, Wrench, Receipt } from 'lucide-react';

export default function CostSummaryCard({ costs, loading }) {
  if (loading) {
    return (
      <div className="panel p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-base-mid rounded-lg mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-base-mid rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!costs) {
    return (
      <div className="panel p-10 flex flex-col items-center justify-center text-center">
        <DollarSign className="w-12 h-12 text-text-secondary opacity-30 mb-3" />
        <p className="text-text-secondary font-medium">Select a vehicle to view its cost summary.</p>
      </div>
    );
  }

  const formatCost = (val) =>
    `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const metrics = [
    {
      label: 'Total Ops Cost',
      value: formatCost(costs.operationalCost),
      icon: DollarSign,
      iconColor: '#F5A623',
      iconBg: 'rgba(245,166,35,0.12)',
      border: 'rgba(245,166,35,0.3)',
    },
    {
      label: 'Fuel Cost',
      value: formatCost(costs.fuelTotal),
      icon: Droplet,
      iconColor: '#3B82F6',
      iconBg: 'rgba(59,130,246,0.12)',
      border: '#E8E2D8',
    },
    {
      label: 'Maintenance',
      value: formatCost(costs.maintenanceTotal),
      icon: Wrench,
      iconColor: '#F43F5E',
      iconBg: 'rgba(244,63,94,0.12)',
      border: '#E8E2D8',
    },
    {
      label: 'Other Expenses',
      value: formatCost(costs.expenseTotal),
      icon: Receipt,
      iconColor: '#10B981',
      iconBg: 'rgba(16,185,129,0.12)',
      border: '#E8E2D8',
    },
  ];

  return (
    <div className="panel p-6">
      <h3 className="text-lg font-bold font-display text-text-primary mb-6">Vehicle Cost Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white p-5 rounded-2xl flex flex-col" style={{ border: `1px solid ${m.border}`, boxShadow: '0 1px 3px rgba(28,35,51,0.07)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: m.iconBg }}>
                  <Icon className="w-5 h-5" style={{ color: m.iconColor }} />
                </div>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{m.label}</span>
              </div>
              <span className="text-2xl font-mono font-bold text-text-primary">{m.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
