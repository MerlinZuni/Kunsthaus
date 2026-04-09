import { useState, useEffect } from 'react';

function useDataMode() {
  const [mode, setMode] = useState('planning');
  useEffect(() => {
    const update = () => {
      setMode(document.documentElement.getAttribute('data-mode') || 'planning');
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    return () => observer.disconnect();
  }, []);
  return mode;
}

export default function GridOverlay() {
  const mode = useDataMode();
  const color = mode === 'onsite' ? '#fbf8f7' : '#222222';
  const opacity = 0.20;
  const tracks = 48;

  // Responsive: halve column count on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const activeTracks = isMobile ? 24 : tracks;

  // Custom row pattern: 80px, 80px, 160px, 160px, 160px — then repeats
  const rowPattern = [80, 80, 160, 160, 160];
  const rowSizes: number[] = [];
  let totalHeight = 0;
  while (totalHeight < 2000) {
    for (const size of rowPattern) {
      rowSizes.push(size);
      totalHeight += size;
      if (totalHeight >= 2000) break;
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 15,
        display: 'grid',
        gridTemplateColumns: `repeat(${activeTracks}, 1fr)`,
        gridTemplateRows: rowSizes.map(s => `${s}px`).join(' '),
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Vertical lines */}
      {Array.from({ length: activeTracks }).map((_, i) => (
        <div
          key={`col-${i}`}
          style={{
            borderLeft: `1px solid ${color}`,
            opacity,
            gridRow: '1 / -1',
            gridColumn: i + 1,
          }}
        />
      ))}
      {/* Horizontal rows — custom spacing: 80, 80, 160, 160, 160 repeating */}
      {rowSizes.map((_, i) => (
        <div
          key={`row-${i}`}
          style={{
            borderTop: `1px solid ${color}`,
            opacity,
            gridColumn: '1 / -1',
            gridRow: i + 1,
          }}
        />
      ))}
    </div>
  );
}
