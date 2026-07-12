import { useState } from 'react';
import { Pencil, ChevronUp, ChevronDown } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const COLUMNS = [
  { key: 'reg_number', label: 'Reg Number' },
  { key: 'name',       label: 'Name'       },
  { key: 'type',       label: 'Type'       },
  { key: 'max_capacity', label: 'Capacity (kg)' },
  { key: 'status',     label: 'Status'     },
];

// Skeleton row for loading state
export function VehicleTableSkeleton() {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-app-border bg-base-mid/50">
              {COLUMNS.map(c => (
                <th key={c.key} className="px-5 py-3.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {c.label}
                </th>
              ))}
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-app-border/50">
                {COLUMNS.map(c => (
                  <td key={c.key} className="px-5 py-4">
                    <div className="h-4 bg-surface-raised rounded-lg animate-pulse" style={{ width: c.key === 'status' ? '80px' : '100%' }} />
                  </td>
                ))}
                <td className="px-5 py-4">
                  <div className="h-4 w-16 bg-surface-raised rounded-lg animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function VehicleTable({ vehicles, canEdit, onEdit }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...vehicles].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-app-border bg-base-mid/50">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer select-none hover:text-text-primary transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key
                      ? sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      : <span className="w-3.5 h-3.5 opacity-0 group-hover:opacity-30"><ChevronUp /></span>
                    }
                  </span>
                </th>
              ))}
              {canEdit && <th className="px-5 py-3.5 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border/50">
            {sorted.map(vehicle => (
              <tr
                key={vehicle.id}
                className="hover:bg-surface-raised/30 transition-colors group"
              >
                <td className="px-5 py-4">
                  <span className="font-mono text-sm font-semibold text-text-primary tracking-tight">{vehicle.reg_number}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-text-primary">{vehicle.name}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-text-secondary">{vehicle.type}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-sm font-semibold text-text-primary">{vehicle.max_capacity?.toLocaleString()}</span> <span className="text-xs text-text-secondary">kg</span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={vehicle.status} />
                </td>
                {canEdit && (
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-raised hover:text-accent-signal rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50 focus-visible:opacity-100"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
