import { useEffect, useRef } from 'react';

// React Bits BlurText without motion. Each segment runs the component's default
// keyframes (blur 10 → 5 → 0, opacity 0 → 0.5 → 1, y ∓50 → ±5 → 0) through the
// Web Animations API with the same linear timing and per-segment delay.
const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  stepDuration = 0.35
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef(null);
  const offset = direction === 'top' ? 1 : -1;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const frames = [
      { filter: 'blur(10px)', opacity: 0, transform: `translateY(${-50 * offset}px)` },
      { filter: 'blur(5px)', opacity: 0.5, transform: `translateY(${5 * offset}px)` },
      { filter: 'blur(0px)', opacity: 1, transform: 'translateY(0px)' }
    ];
    let animations = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animations = [...root.children].map((span, index) => {
          const animation = span.animate(frames, {
            duration: stepDuration * (frames.length - 1) * 1000,
            delay: index * delay,
            easing: 'linear',
            fill: 'both'
          });
          animation.onfinish = () => {
            animation.commitStyles();
            animation.cancel();
          };
          return animation;
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
    };
  }, [delay, offset, stepDuration, threshold, rootMargin]);

  const initial = { filter: 'blur(10px)', opacity: 0, transform: `translateY(${-50 * offset}px)` };

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => (
        <span key={index} style={initial}>
          {segment === ' ' ? ' ' : segment}
          {animateBy === 'words' && index < elements.length - 1 && ' '}
        </span>
      ))}
    </p>
  );
};

export default BlurText;
