import { useEffect, useRef } from 'react';

// React Bits CountUp without motion. It keeps the component's spring
// (stiffness 100 / duration, damping 20 + 40 / duration, mass 1) and solves it
// in closed form, the way motion's spring generator does, settling once the
// value is within half a unit of the target.
const springAt = (from, to, stiffness, damping) => {
  const x0 = to - from;
  const omega = Math.sqrt(stiffness);
  const zeta = damping / (2 * omega);
  if (zeta < 1) {
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    return t => to - Math.exp(-zeta * omega * t) * (((zeta * omega * x0) / wd) * Math.sin(wd * t) + x0 * Math.cos(wd * t));
  }
  if (zeta === 1) return t => to - Math.exp(-omega * t) * (x0 + omega * x0 * t);
  const wd = omega * Math.sqrt(zeta * zeta - 1);
  return t => {
    const f = Math.min(wd * t, 300);
    return to - (Math.exp(-zeta * omega * t) * (zeta * omega * x0 * Math.sinh(f) + wd * x0 * Math.cosh(f))) / wd;
  };
};

export default function CountUp({ to, from = 0, delay = 0, duration = 2, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const decimals = Math.max(...[from, to].map(n => (String(n).split('.')[1] ?? '').replace(/0+$/, '').length));
    const format = value =>
      Intl.NumberFormat('en-US', { useGrouping: false, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
    el.textContent = format(from);

    const position = springAt(from, to, 100 / duration, 20 + 40 / duration);
    let raf = 0;
    let timeout = 0;
    const run = () => {
      const start = performance.now();
      const tick = now => {
        const value = position((now - start) / 1000);
        if (Math.abs(to - value) <= 0.5) {
          el.textContent = format(to);
          return;
        }
        el.textContent = format(value);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timeout = setTimeout(run, delay * 1000);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [from, to, delay, duration]);

  return <span className={className} ref={ref} />;
}
