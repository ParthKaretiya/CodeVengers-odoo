import { useState } from 'react';
import { ChevronUp, ChevronDown, Check, FileText } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const COLUMNS = [
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'description', label: 'Description' },
  { key: 'cost', label: 'Cost' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'opened_at', label: 'Opened At' },
];

export function MaintenanceListSkeleton() {
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
                    <div className="h-4 bg-surface-raised rounded-lg animate-pulse" style={{ width: c.key === 'description' ? '150px' : '80px' }} />
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

export default function MaintenanceList({ logs, canAction, onClose }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sorted = [...logs].sort((a, b) => {
    if (!sortKey) return 0;
    let av = a[sortKey];
    let bv = b[sortKey];
    
    // Flatten nested objects for sorting if needed
    if (sortKey === 'vehicle') {
      av = a.vehicle?.reg_number;
      bv = b.vehicle?.reg_number;
    }

    if (av === bv) return 0;
    
    return sortDir === 'asc' 
      ? String(av).localeCompare(String(bv)) 
      : String(bv).localeCompare(String(av));
  });

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-status-shop bg-status-shop/10 border-status-shop/20';
      case 'medium': return 'text-accent-signal bg-accent-signal/10 border-accent-signal/20';
      case 'low': return 'text-status-available bg-status-available/10 border-status-available/20';
      default: return 'text-text-secondary bg-surface-raised border-app-border';
    }
  };

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
                      : <span className="w-3.5 h-3.5 opacity-0 group-hover:opacity-30"><ChevronUp /></span>}
                  </span>
                </th>
              ))}
              {canAction && <th className="px-5 py-3.5 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border/50">
            {sorted.map(log => (
              <tr key={log.id} className="hover:bg-surface-raised/30 transition-colors group">
                {/* Vehicle */}
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-sm font-semibold text-text-primary">{log.vehicle?.reg_number}</span>
                    <span className="text-xs text-text-secondary">{log.vehicle?.name}</span>
                  </div>
                </td>
                {/* Description */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 max-w-xs group/desc">
                    <FileText className="w-4 h-4 text-text-secondary shrink-0" />
                    <span className="text-sm font-medium text-text-primary truncate" title={log.description}>{log.description}</span>
                  </div>
                </td>
                {/* Cost */}
                <td className="px-5 py-4">
                  <span className="font-mono text-sm font-semibold text-text-primary">${Number(log.cost).toLocaleString()}</span>
                </td>
                {/* Priority */}
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border ${getPriorityColor(log.priority)}`}>
                    {log.priority}
                  </span>
                </td>
                {/* Status */}
                <td className="px-5 py-4">
                  <StatusBadge status={log.status} />
                </td>
                {/* Opened At */}
                <td className="px-5 py-4">
                  <span className="text-sm text-text-secondary">{new Date(log.opened_at).toLocaleDateString()}</span>
                </td>
                {/* Action */}
                {canAction && (
                  <td className="px-5 py-4 text-right">
                    {log.status === 'open' && (
                      <button
                        onClick={() => onClose(log)}
                        style={{ backgroundColor: '#10B981', color: '#fff' }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg hover:brightness-110 transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-status-available/50 focus-visible:opacity-100"
                      >
                        <Check className="w-3.5 h-3.5" /> Close
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={canAction ? 7 : 6} className="px-5 py-12 text-center">
                  <span className="text-sm font-medium text-text-secondary">No maintenance records found</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
