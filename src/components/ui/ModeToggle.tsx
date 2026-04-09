// ModeToggle.tsx -- D-18 through D-22: React island for planning/onsite mode switching
// Sets data-mode attribute on <html>, persists to localStorage

import { useState, useEffect } from 'react';

interface Props {
  labels: {
    planning: { en: string; de: string; fr?: string };
    onsite: { en: string; de: string; fr?: string };
  };
  lang: 'en' | 'de';
}

export default function ModeToggle({ labels, lang }: Props) {
  const [mode, setMode] = useState<'planning' | 'onsite'>('planning');

  useEffect(() => {
    // Initialize from localStorage or current attribute
    const saved = localStorage.getItem('kunsthaus-mode') as 'planning' | 'onsite' | null;
    const current = document.documentElement.getAttribute('data-mode') as 'planning' | 'onsite' | null;
    const initial = saved || current || 'planning';
    setMode(initial);
    document.documentElement.setAttribute('data-mode', initial);
  }, []);

  const toggle = () => {
    const newMode = mode === 'planning' ? 'onsite' : 'planning';
    setMode(newMode);
    document.documentElement.setAttribute('data-mode', newMode);
    localStorage.setItem('kunsthaus-mode', newMode);

    // Sync all segmented toggles (StickyCTA has desktop + mobile copies)
    document.querySelectorAll('[data-mode-segment]').forEach((el) => {
      const btn = el as HTMLElement;
      const isActive = btn.dataset.modeSegment === newMode;
      btn.classList.toggle('sticky-cta__segment--active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={mode === 'onsite'}
      className="mode-toggle hover-wipe-inverse touch-pulse touch-target"
      type="button"
    >
      <span>{mode === 'planning' ? labels.planning[lang] : labels.onsite[lang]}</span>
    </button>
  );
}
