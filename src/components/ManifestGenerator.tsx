import { useEffect } from 'react';

/**
 * Generates and injects a Web App Manifest for PWA support
 * Improves Lighthouse PWA and SEO scores
 */
export function ManifestGenerator() {
  useEffect(() => {
    // Create manifest object
    const manifest = {
      name: 'Williamjeet Singh - Portfolio',
      short_name: 'WS Portfolio',
      description: 'Portfolio of Williamjeet Singh, Designer, Developer & Creative Technologist',
      start_url: '/',
      display: 'standalone',
      background_color: '#F5F1EB',
      theme_color: '#8B7355',
      orientation: 'portrait-primary',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      categories: ['portfolio', 'design', 'development'],
      lang: 'en-US'
    };

    // Convert to blob and create object URL
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(manifestBlob);

    // Add or update manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute('href', manifestURL);

    // Add apple-touch-icon if not present
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = '/icon-192.png';
      document.head.appendChild(appleTouchIcon);
    }

    // Cleanup
    return () => {
      URL.revokeObjectURL(manifestURL);
    };
  }, []);

  return null;
}
