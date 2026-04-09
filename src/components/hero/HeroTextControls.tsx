import { useControls } from 'leva';
import { useEffect } from 'react';

export default function HeroTextControls() {
  const {
    blendMode,
    textColor,
    textOpacity,
  } = useControls('Hero Title', {
    blendMode: {
      value: 'multiply',
      options: [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      label: 'Blend Mode',
    },
    textColor: { value: '#272523', label: 'Text Color' },
    textOpacity: { value: 1.0, min: 0, max: 1, step: 0.05, label: 'Opacity' },
  });

  useEffect(() => {
    const textEl = document.querySelector('.hero-carousel__text') as HTMLElement;
    const titleEl = document.querySelector('.hero-carousel__title') as HTMLElement;
    if (textEl) {
      textEl.style.mixBlendMode = blendMode;
    }
    if (titleEl) {
      titleEl.style.color = textColor;
      titleEl.style.opacity = String(textOpacity);
    }
  }, [blendMode, textColor, textOpacity]);

  return null;
}
