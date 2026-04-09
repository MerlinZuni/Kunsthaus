// SectionProgress.tsx -- D-27: Fraction counter + progress arc
// React island for interactive section tracking via sectionchange events

import { useState, useEffect } from 'react';

interface Props {
  totalSections: number;
  sectionNames: string[];
  slideNames?: string[];
}

export default function SectionProgress({ totalSections, sectionNames, slideNames = [] }: Props) {
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Listen for sectionchange events dispatched by SectionWrapper ScrollTrigger
    const handleSectionChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.index === 'number') {
        setCurrentSection(detail.index);
      }
    };

    window.addEventListener('sectionchange', handleSectionChange);

    // Also track scroll progress within current section
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('.stacking-section');
      if (!sections.length) return;

      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      // Find which section is most visible
      let bestIndex = 0;
      let bestVisibility = 0;

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportH, rect.bottom);
        const visibility = Math.max(0, visibleBottom - visibleTop);

        if (visibility > bestVisibility) {
          bestVisibility = visibility;
          bestIndex = i;
        }
      });

      setCurrentSection(bestIndex);

      // Calculate progress within that section
      const activeSection = sections[bestIndex];
      if (activeSection) {
        const rect = activeSection.getBoundingClientRect();
        const sectionProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - viewportH)));
        setProgress(isFinite(sectionProgress) ? sectionProgress : 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize

    return () => {
      window.removeEventListener('sectionchange', handleSectionChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const displayTotal = totalSections || sectionNames.length;
  const current = currentSection + 1;
  const currentName = sectionNames[currentSection] || '';
  const circumference = 2 * Math.PI * 14;
  const overallProgress = displayTotal > 0 ? current / displayTotal : 0;
  const dashOffset = circumference * (1 - (overallProgress + progress / displayTotal));

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
            display: none;
          }
        }
      `}</style>
      <div
        className="section-progress"
        role="status"
        aria-live="polite"
        aria-label={`Section ${current} of ${displayTotal}: ${currentName}`}
        tabIndex={0}
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
            strokeDashoffset={Math.max(0, dashOffset)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
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
          {String(current).padStart(2, '0')} / {String(displayTotal).padStart(2, '0')}
        </span>

        {/* Section name (visible on tablet) */}
        <span
          className="section-progress__title"
          style={{
            fontSize: 'var(--type-sm, 0.75rem)',
            fontWeight: 'var(--weight-light, 300)',
            color: 'var(--color-text, #272523)',
            marginLeft: '0.5rem',
          }}
        >
          {currentName}
        </span>
      </div>
    </>
  );
}
