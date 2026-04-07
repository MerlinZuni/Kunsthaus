// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // Fonts API configuration -- uncomment when .woff2 font files are added
  // to src/assets/fonts/DINNextW1G/. The local() provider requires files
  // to exist at build time. Until then, the fallback font stack in
  // typography.css handles font rendering.
  //
  // fonts: [
  //   {
  //     provider: fontProviders.local(),
  //     name: 'DINNextW1G',
  //     cssVariable: '--font-primary',
  //     options: {
  //       variants: [
  //         { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Light.woff2'], weight: '300', style: 'normal' },
  //         { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Regular.woff2'], weight: '400', style: 'normal' },
  //         { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Medium.woff2'], weight: '500', style: 'normal' },
  //         { src: ['./src/assets/fonts/DINNextW1G/DINNextW1G-Bold.woff2'], weight: '700', style: 'normal' },
  //       ],
  //     },
  //   },
  // ],
});
