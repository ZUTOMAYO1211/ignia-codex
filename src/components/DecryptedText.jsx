import { useEffect, useRef, useState } from 'react';

// React Bits DecryptedText trimmed to the mode the codex uses: when the text
// scrolls into view it reveals one character per tick from the start while the
// rest keep scrambling. Hover, click, reverse, and non-sequential modes and the
// motion wrapper are gone. Screen readers get the finished text.
export default function DecryptedText({
  text,
  speed = 50,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = ''
}) {
  // null means not started yet, so the plain text shows until it is in view.
  const [revealed, setRevealed] = useState(null);
  const ref = useRef(null);
  const chars = Array.from(characters);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setRevealed(0);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (revealed === null || revealed >= text.length) return;
    const id = setTimeout(() => setRevealed(r => r + 1), speed);
    return () => clearTimeout(id);
  }, [revealed, speed, text.length]);

  return (
    <span ref={ref} className={parentClassName} style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {text.split('').map((char, index) => {
          const done = revealed === null || index < revealed;
          return (
            <span key={index} className={done ? className : encryptedClassName}>
              {done || char === ' ' ? char : chars[Math.floor(Math.random() * chars.length)]}
            </span>
          );
        })}
      </span>
    </span>
  );
}
