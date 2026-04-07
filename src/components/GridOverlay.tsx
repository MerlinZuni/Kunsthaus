import { useControls } from 'leva';
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
  const autoColor = mode === 'onsite' ? '#fbf8f7' : '#222222';

  const {
    visible,
    density,
    fullViewport,
    showRows,
    opacity,
  } = useControls('Grid Overlay', {
    visible: { value: true, label: 'Show Grid' },
    density: { value: 12, options: [12, 24, 48], label: 'Column Density' },
    fullViewport: { value: true, label: 'Full Viewport' },
    showRows: { value: false, label: 'Show Rows' },
    opacity: { value: 0.20, min: 0, max: 1, step: 0.01, label: 'Opacity' },
  });

  const color = autoColor;

  if (!visible) return null;

  // Map density to actual track count
  // density 12 = 12 lines (layout columns), 24 = half-columns, 48 = all tracks
  const tracks = density;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(${tracks}, 1fr)`,
        gridTemplateRows: showRows ? 'repeat(8, 1fr)' : 'none',
        width: fullViewport ? '100vw' : undefined,
        height: showRows ? '100vh' : undefined,
        maxWidth: fullViewport ? 'none' : undefined,
      }}
    >
      {/* Vertical lines -- left edge of each column per D-28 */}
      {Array.from({ length: tracks }).map((_, i) => (
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
      {/* Horizontal rows -- visually distinct from vertical per D-21 */}
      {showRows &&
        Array.from({ length: 8 }).map((_, i) => (
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
