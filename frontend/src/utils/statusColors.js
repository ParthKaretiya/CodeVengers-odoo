/**
 * Single source of truth for ALL status colors across the app.
 * Uses hex values so they work reliably in both Tailwind classes and inline styles.
 * 
 * STATUS_META  — use getStatusColor() / getStatusMeta() in components
 * STATUS_COLORS — legacy Tailwind class map, kept for non-badge usages
 */

export const STATUS_META = {
  // Trip statuses
  draft:      { hex: '#8B93A7', label: 'Draft'      },
  dispatched: { hex: '#3B82F6', label: 'Dispatched'  },
  completed:  { hex: '#10B981', label: 'Completed'   },
  cancelled:  { hex: '#F43F5E', label: 'Cancelled'   },

  // Vehicle statuses
  available:  { hex: '#10B981', label: 'Available'   },
  on_trip:    { hex: '#3B82F6', label: 'On Trip'     },
  in_shop:    { hex: '#F5A623', label: 'In Shop'     },
  retired:    { hex: '#8B93A7', label: 'Retired'     },

  // Driver statuses
  off_duty:   { hex: '#8B93A7', label: 'Off Duty'    },
  suspended:  { hex: '#F43F5E', label: 'Suspended'   },

  // Maintenance
  open:       { hex: '#F5A623', label: 'Open'        },
  closed:     { hex: '#10B981', label: 'Closed'      },

  // License
  expired:    { hex: '#F43F5E', label: 'Expired'     },
};

/** Returns the hex color for a given status, with a safe fallback. */
export function getStatusColor(status) {
  return STATUS_META[status]?.hex ?? '#8B93A7';
}

/** Returns the full meta object for a given status. */
export function getStatusMeta(status) {
  return STATUS_META[status] ?? STATUS_META.draft;
}

// Legacy Tailwind class map — kept so existing non-badge code doesn't break
export const STATUS_COLORS = {
  available:  { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  on_trip:    { bg: 'bg-accent-signal/10',    text: 'text-accent-signal',    dot: 'bg-accent-signal',    border: 'border-accent-signal/20'    },
  in_shop:    { bg: 'bg-status-shop/10',      text: 'text-status-shop',      dot: 'bg-status-shop',      border: 'border-status-shop/20'      },
  retired:    { bg: 'bg-surface-raised',      text: 'text-text-secondary',   dot: 'bg-status-retired',   border: 'border-surface-raised'      },
  off_duty:   { bg: 'bg-surface-raised',      text: 'text-text-secondary',   dot: 'bg-status-retired',   border: 'border-surface-raised'      },
  suspended:  { bg: 'bg-surface-raised',      text: 'text-text-secondary',   dot: 'bg-status-retired',   border: 'border-surface-raised'      },
  draft:      { bg: 'bg-surface-raised',      text: 'text-text-secondary',   dot: 'bg-status-retired',   border: 'border-surface-raised'      },
  dispatched: { bg: 'bg-surface-raised',      text: 'text-text-secondary',   dot: 'bg-status-retired',   border: 'border-surface-raised'      },
  completed:  { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  cancelled:  { bg: 'bg-surface-raised',      text: 'text-text-secondary',   dot: 'bg-status-retired',   border: 'border-surface-raised'      },
  open:       { bg: 'bg-status-shop/10',      text: 'text-status-shop',      dot: 'bg-status-shop',      border: 'border-status-shop/20'      },
  closed:     { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  expired:    { bg: 'bg-surface-raised',      text: 'text-text-secondary',   dot: 'bg-status-retired',   border: 'border-surface-raised'      },
};
