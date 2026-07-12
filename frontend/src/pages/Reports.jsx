import { useEffect } from 'react';
import { Download, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { useReports } from '../hooks/useReports';
import ReportTabs from '../components/reports/ReportTabs';
import ReportTable from '../components/reports/ReportTable';

// ─── Column Definitions per tab ────────────────────────────────────────────
const COLUMNS = {
  fuel_efficiency: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'liters', label: 'Liters', suffix: ' L', mono: true },
    { key: 'cost', label: 'Cost', prefix: '$', mono: true },
    {
      key: 'kmPerLiter',
      label: 'km/L',
      mono: true,
      render: (val) => (
        <span
          className="font-mono font-bold"
          style={{ color: val >= 5 ? '#10B981' : val >= 4 ? '#F5A623' : '#F43F5E' }}
        >
          {val}
        </span>
      )
    },
    { key: 'trips', label: 'Trips', mono: true },
  ],
  utilization: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'activeDays', label: 'Active Days', mono: true },
    { key: 'totalDays', label: 'Total Days', mono: true },
    {
      key: 'utilization',
      label: 'Utilization %',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E2D8', minWidth: '80px' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${val}%`,
                backgroundColor: val >= 80 ? '#10B981' : val >= 50 ? '#F5A623' : '#F43F5E'
              }}
            />
          </div>
          <span
            className="font-mono font-bold text-sm w-10 text-right"
            style={{ color: val >= 80 ? '#10B981' : val >= 50 ? '#F5A623' : '#F43F5E' }}
          >
            {val}%
          </span>
        </div>
      )
    },
  ],
  operational_cost: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'fuel', label: 'Fuel ($)', prefix: '$', mono: true },
    { key: 'maintenance', label: 'Maintenance ($)', prefix: '$', mono: true },
    { key: 'other', label: 'Other ($)', prefix: '$', mono: true },
    {
      key: 'total',
      label: 'Total ($)',
      render: (val) => (
        <span className="font-mono font-bold text-sm" style={{ color: '#F5A623' }}>
          ${val.toLocaleString()}
        </span>
      )
    },
  ],
  roi: [
    { key: 'vehicle', label: 'Vehicle', mono: true },
    { key: 'name', label: 'Model' },
    { key: 'revenue', label: 'Revenue ($)', prefix: '$', mono: true },
    { key: 'cost', label: 'Cost ($)', prefix: '$', mono: true },
    { key: 'profit', label: 'Profit ($)', prefix: '$', mono: true },
    {
      key: 'roi',
      label: 'ROI %',
      render: (val) => (
        <span className="font-mono font-bold text-sm" style={{ color: '#10B981' }}>
          {val}%
        </span>
      )
    },
  ],
};

// Bar chart color per utilization level
function UtilizationBar({ data }) {
  if (!data?.length) return null;
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
        Utilization by Vehicle
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
          <CartesianGrid vertical={false} stroke="rgba(34,51,90,0.5)" />
          <XAxis
            dataKey="vehicle"
            tick={{ fill: '#8B9BB8', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#8B9BB8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '12px', color: '#1C2333', boxShadow: '0 4px 16px rgba(28,35,51,0.12)' }}
            formatter={(v) => [`${v}%`, 'Utilization']}
            cursor={{ fill: 'rgba(245,166,35,0.05)' }}
          />
          <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.utilization >= 80 ? '#10B981' : entry.utilization >= 50 ? '#F5A623' : '#F43F5E'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ReportsPage() {
  const { role } = useAuth();
  const defaultTab = role === ROLES.ANALYST ? 'roi' : 'fuel_efficiency';
  const { activeTab, data, loading, switchTab, fetchTab, exportCsv } = useReports(defaultTab);

  // Fetch on mount
  useEffect(() => { fetchTab(defaultTab); }, []);  // eslint-disable-line

  const cols = COLUMNS[activeTab] || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-fraunces font-bold text-text-primary tracking-tight"><em style={{ fontStyle: 'italic', fontWeight: 600 }}>Fleet</em> Reports</h1>
          <p className="text-text-secondary mt-1">Analyse fleet performance, costs, and ROI.</p>
        </div>
        <button
          id="export-csv-btn"
          onClick={exportCsv}
          disabled={loading || !data.length}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', color: '#6B7280', boxShadow: '0 1px 3px rgba(28,35,51,0.07)' }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:text-text-primary hover:border-accent-signal/50 transition-all focus:outline-none disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <ReportTabs activeTab={activeTab} onSwitch={switchTab} role={role} />

      {/* Chart (only on utilization tab) */}
      {activeTab === 'utilization' && !loading && data.length > 0 && (
        <div className="panel p-6">
          <UtilizationBar data={data} />
        </div>
      )}

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-app-border flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-bold text-text-primary capitalize">
            {activeTab.replace(/_/g, ' ')} Report
          </h3>
          {!loading && data.length > 0 && (
            <span className="ml-auto text-xs text-text-secondary font-mono">{data.length} vehicles</span>
          )}
        </div>
        <ReportTable columns={cols} data={data} loading={loading} />
      </div>
    </div>
  );
}
