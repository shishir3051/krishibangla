import type { MetadataRoute } from 'next';

// Icons are generated from app/icon.svg by `npm run build:icons`.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'কৃষিবাংলা · KrishiBangla',
    short_name: 'KrishiBangla',
    description: 'Weather, irrigation advice, market prices and climate alerts for farmers in Bangladesh.',
    lang: 'bn',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f7f2',
    theme_color: '#1f7a3f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
