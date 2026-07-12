import { getStatusMeta } from '../../utils/statusColors';

/**
 * Status badge that ALWAYS shows color — uses inline styles so
 * Tailwind JIT opacity limitations never interfere.
 *
 * Visual spec:
 *  - Background: status color at 15% opacity
 *  - Text:       status color at 100%
 *  - Border:     status color at 25% opacity
 *  - Dot:        status color at 100%, small glow
 */
export default function StatusBadge({ status }) {
  const { hex, label } = getStatusMeta(status);

  // Convert hex to rgba manually for the tinted background
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return (
    <span
      style={{
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
        color: hex,
        border: `1px solid rgba(${r}, ${g}, ${b}, 0.30)`,
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-widest font-bold whitespace-nowrap select-none"
    >
      <span
        style={{
          backgroundColor: hex,
          boxShadow: `0 0 6px rgba(${r}, ${g}, ${b}, 0.7)`,
        }}
        className="w-1.5 h-1.5 rounded-full shrink-0"
      />
      {label}
    </span>
  );
}
