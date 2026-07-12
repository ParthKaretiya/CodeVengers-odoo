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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {COLUMNS.map(c => (
                <th key={c.key} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {c.label}
                </th>
              ))}
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-50">
                {COLUMNS.map(c => (
                  <td key={c.key} className="px-5 py-4">
                    <div className="h-4 bg-slate-100 rounded-lg animate-pulse"
                      style={{ width: c.key === 'status' ? '80px' : c.key === 'safety_score' ? '60px' : '100%' }} />
                  </td>
                ))}
                <td className="px-5 py-4">
                  <div className="h-4 w-24 bg-slate-100 rounded-lg animate-pulse" />
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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-800 transition-colors"
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
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {sorted.map(driver => (
              <tr key={driver.id} className="hover:bg-slate-50/70 transition-colors group">
                {/* Name + expired warning */}
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-800">{driver.name}</span>
                    {driver.isLicenseExpired && (
                      <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Ineligible for dispatch
                      </span>
                    )}
                  </div>
                </td>

                {/* License number */}
                <td className="px-5 py-4">
                  <span className="font-mono text-sm text-slate-600">{driver.license_number}</span>
                </td>

                {/* License expiry badge */}
                <td className="px-5 py-4">
                  <LicenseBadge expiryDate={driver.license_expiry} />
                </td>

                {/* Safety score bar */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 w-28">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${driver.safety_score >= 80 ? 'bg-emerald-500' : driver.safety_score >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                        style={{ width: `${driver.safety_score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 w-8 text-right">{driver.safety_score}</span>
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                      {canSuspend && driver.status !== 'suspended' && (
                        <button
                          onClick={() => onSuspend(driver)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
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
