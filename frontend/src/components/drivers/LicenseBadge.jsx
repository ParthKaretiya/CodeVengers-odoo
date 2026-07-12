/**
 * LicenseBadge — shows days until expiry with colour-coded urgency.
 *
 * Rules (per spec):
 *   expired or < 0 days  → red   "Expired"
 *   < 30 days            → red   "X days left"
 *   < 90 days            → yellow "X days left"
 *   ≥ 90 days            → green  "X days left"
 */
export default function LicenseBadge({ expiryDate }) {
  const expiry = new Date(expiryDate);
  const now    = new Date();
  const msLeft = expiry - now;
  const days   = Math.floor(msLeft / 86400000);

  let label, cls;

  if (days < 0) {
    label = 'Expired';
    cls   = 'bg-red-100 text-red-700 border-red-200';
  } else if (days < 30) {
    label = `${days}d left`;
    cls   = 'bg-red-100 text-red-700 border-red-200';
  } else if (days < 90) {
    label = `${days}d left`;
    cls   = 'bg-amber-100 text-amber-700 border-amber-200';
  } else {
    label = `${days}d left`;
    cls   = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }

  // Human-readable expiry date below the badge
  const formatted = expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border w-fit ${cls}`}>
        {label}
      </span>
      <span className="text-xs text-slate-400">{formatted}</span>
    </div>
  );
}
