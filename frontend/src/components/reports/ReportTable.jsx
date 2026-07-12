import { ChevronUp, ChevronDown, BarChart2 } from 'lucide-react';
import { useState } from 'react';

function TableSkeleton({ cols }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-app-border">
            {cols.map((_, i) => (
              <th key={i} className="px-5 py-3.5">
                <div className="h-3 w-20 bg-base-mid rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, r) => (
            <tr key={r} className="border-b border-app-border/40">
              {cols.map((_, c) => (
                <td key={c} className="px-5 py-4">
                  <div className="h-4 bg-base-mid rounded animate-pulse" style={{ width: c === 0 ? '80px' : '60px' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReportTable({ columns, data, loading }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  if (loading) return <TableSkeleton cols={columns} />;

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(139,155,184,0.1)' }}>
          <BarChart2 className="w-8 h-8 text-text-secondary opacity-40" />
        </div>
        <p className="text-base font-bold text-text-primary mb-1">Not enough data yet</p>
        <p className="text-sm text-text-secondary max-w-xs">Log some trips and fuel entries first to see this report.</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey], bv = b[sortKey];
    if (av === bv) return 0;
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid #E8E2D8', backgroundColor: '#FAFAF9' }}>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-text-secondary select-none"
                style={{ cursor: col.sortable !== false ? 'pointer' : 'default' }}
              >
                <span className="inline-flex items-center gap-1 hover:text-text-primary transition-colors">
                  {col.label}
                  {sortKey === col.key && (
                    sortDir === 'asc'
                      ? <ChevronUp className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ borderBottom: '1px solid rgba(232,226,216,0.8)' }}>
          {sorted.map((row, i) => (
            <tr
              key={i}
              className="group transition-colors"
              style={{ borderBottom: '1px solid rgba(232,226,216,0.8)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAF7F2'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {columns.map(col => (
                <td key={col.key} className="px-5 py-4 text-sm">
                  {col.render ? col.render(row[col.key], row) : (
                    <span className={col.mono ? 'font-mono font-semibold text-text-primary' : 'text-text-primary'}>
                      {col.prefix}{row[col.key]}{col.suffix}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
