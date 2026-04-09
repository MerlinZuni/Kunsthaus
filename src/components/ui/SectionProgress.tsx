// SectionProgress.tsx -- D-27: Fraction counter + progress arc
// React island for interactive section tracking
// GSAP ScrollTrigger integration will come in Phase 3

interface Props {
  totalSections: number;
  sectionNames: string[];
  slideNames?: string[];
}

export default function SectionProgress({ totalSections, sectionNames, slideNames = [] }: Props) {
  // Static display for Phase 2 -- will be driven by ScrollTrigger in Phase 3
  const current = 1;
  const currentSlideName = slideNames[0] || '';
  const progress = totalSections > 0 ? current / totalSections : 0;
  const circumference = 2 * Math.PI * 14;
  const dashOffset = circumference * (1 - progress);

  return (
    <>
      <style>{`
        .section-progress {
          position: fixed;
          bottom: calc(15vh + 5rem);
          left: 2rem;
          z-index: 15;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .section-progress__title {
          display: none;
        }
        @media (max-width: 767px) {
          .section-progress {
            bottom: calc(50px + 4rem);
            left: 1rem;
          }
          .section-progress__title {
            display: inline;
          }
        }
      `}</style>
    <div
      className="section-progress"
      role="status"
      aria-live="polite"
      aria-label={`Slide ${current} of ${totalSections}: ${currentSlideName}`}
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

      {/* Slide title -- visible on mobile where tabs are hidden */}
      <span className="section-progress__title"
        style={{
          fontSize: 'var(--type-sm, 0.75rem)',
          fontWeight: 'var(--weight-light, 300)',
          color: 'var(--color-text, #272523)',
          marginLeft: '0.5rem',
        }}
      >
        {currentSlideName}
      </span>
    </div>
    </>
  );
}
