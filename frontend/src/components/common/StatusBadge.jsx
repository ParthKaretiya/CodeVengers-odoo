import { useEffect, useRef, useState } from 'react';
import { getStatusMeta } from '../../utils/statusColors';

/**
 * Status badge with a one-shot brightness pulse when the status changes.
 * Uses CSS animation class added/removed so it's fully declarative.
 * Respects prefers-reduced-motion (CSS @media handles it globally).
 */
export default function StatusBadge({ status }) {
  const { hex, label } = getStatusMeta(status);
  const prevStatus = useRef(status);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (prevStatus.current !== status) {
      prevStatus.current = status;
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 350);
      return () => clearTimeout(t);
    }
  }, [status]);

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return (
    <span
      style={{
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
        color: hex,
        border: `1px solid rgba(${r}, ${g}, ${b}, 0.30)`,
        transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-widest font-bold whitespace-nowrap select-none${pulsing ? ' badge-pulse' : ''}`}
    >
      <span
        style={{
          backgroundColor: hex,
          boxShadow: `0 0 6px rgba(${r}, ${g}, ${b}, 0.7)`,
          transition: 'background-color 150ms ease, box-shadow 150ms ease',
        }}
        className="w-1.5 h-1.5 rounded-full shrink-0"
      />
      {label}
    </span>
  );
}
