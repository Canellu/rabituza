import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rabituza',
    short_name: 'Rabituza',
    description: 'Track & Train',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#09090b',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
