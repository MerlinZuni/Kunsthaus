// SectionProgress.tsx -- D-27: Fraction counter + progress arc
// React island for interactive section tracking
// GSAP ScrollTrigger integration will come in Phase 3

interface Props {
  totalSections: number;
  sectionNames: string[];
}

export default function SectionProgress({ totalSections, sectionNames }: Props) {
  // Static display for Phase 2 -- will be driven by ScrollTrigger in Phase 3
  const current = 1;
  const currentName = sectionNames[0] || '';
  const progress = totalSections > 0 ? current / totalSections : 0;
  const circumference = 2 * Math.PI * 14;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="section-progress"
      role="status"
      aria-live="polite"
      aria-label={`Section ${current} of ${totalSections}: ${currentName}`}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {/* Progress arc */}
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--color-decorative, #C1BFB2)"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--color-text, #272523)"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Fraction counter */}
      <span
        style={{
          fontSize: 'var(--type-sm, 0.75rem)',
          fontWeight: 'var(--weight-regular, 400)',
          color: 'var(--color-text, #272523)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(current).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
      </span>
    </div>
  );
}
