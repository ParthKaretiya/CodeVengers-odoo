import { useState } from 'react';
import { Pencil, ShieldAlert, ChevronUp, ChevronDown } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import LicenseBadge from './LicenseBadge';

const COLUMNS = [
  { key: 'name',            label: 'Name'           },
  { key: 'license_number',  label: 'License #'      },
  { key: 'license_expiry',  label: 'Expiry'         },
  { key: 'safety_score',    label: 'Safety Score'   },
  { key: 'status',          label: 'Status'         },
];

export function DriverTableSkeleton() {
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
                    <div className="h-4 bg-surface-raised rounded-lg animate-pulse"
                      style={{ width: c.key === 'status' ? '80px' : c.key === 'safety_score' ? '60px' : '100%' }} />
                  </td>
                ))}
                <td className="px-5 py-4">
                  <div className="h-4 w-24 bg-surface-raised rounded-lg animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DriverTable({ drivers, canEdit, canSuspend, onEdit, onSuspend }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...drivers].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const hasActions = canEdit || canSuspend;

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
                      : null}
                  </span>
                </th>
              ))}
              {hasActions && (
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-app-border/50">
            {sorted.map(driver => (
              <tr key={driver.id} className="hover:bg-surface-raised/30 transition-colors group">
                {/* Name + expired warning */}
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-text-primary">{driver.name}</span>
                    {driver.isLicenseExpired && (
                      <span className="text-xs text-status-shop font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Ineligible for dispatch
                      </span>
                    )}
                  </div>
                </td>

                {/* License number */}
                <td className="px-5 py-4">
                  <span className="font-mono text-sm font-semibold text-text-secondary">{driver.license_number}</span>
                </td>

                {/* License expiry badge */}
                <td className="px-5 py-4">
                  <LicenseBadge expiryDate={driver.license_expiry} />
                </td>

                {/* Safety score bar */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 w-28">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-raised overflow-hidden">
                      <div
                        className={`h-full rounded-full ${driver.safety_score >= 80 ? 'bg-status-available' : driver.safety_score >= 50 ? 'bg-accent-signal' : 'bg-status-shop'}`}
                        style={{ width: `${driver.safety_score}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold text-text-primary w-8 text-right">{driver.safety_score}</span>
                  </div>
                </td>

                {/* Status badge */}
                <td className="px-5 py-4">
                  <StatusBadge status={driver.status} />
                </td>

                {/* Actions */}
                {hasActions && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canEdit && (
                        <button
                          onClick={() => onEdit(driver)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-raised hover:text-accent-signal rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50 focus-visible:opacity-100"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                      {canSuspend && driver.status !== 'suspended' && (
                        <button
                          onClick={() => onSuspend(driver)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-status-shop bg-status-shop/10 hover:bg-status-shop/20 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-signal/50 focus-visible:opacity-100"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" /> Suspend
                        </button>
                      )}
                    </div>
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
