import { useEffect, useRef, useState } from 'react';

/**
 * Counts up from 0 to `target` over `duration` ms using ease-out cubic.
 * Returns the current display value (integer).
 * Respects prefers-reduced-motion — returns target instantly if motion is reduced.
 */
export function useCountUp(target, duration = 500) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target == null || isNaN(Number(target))) return;

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setValue(Number(target)); return; }

    const numTarget = Number(target);
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: 1 - (1-t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * numTarget));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}
