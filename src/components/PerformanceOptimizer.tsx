import { useEffect } from 'react';

/**
 * Performance optimization component for better Lighthouse scores
 * Handles preconnects, DNS prefetch, and other performance hints
 */
export function PerformanceOptimizer() {
  useEffect(() => {
    // Add resource hints for better performance
    const addResourceHint = (rel: string, href: string, crossorigin?: boolean) => {
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) return;
      
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossorigin) link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preconnect to external resources
    addResourceHint('preconnect', 'https://fonts.googleapis.com');
    addResourceHint('preconnect', 'https://fonts.gstatic.com', true);
    addResourceHint('dns-prefetch', 'https://images.unsplash.com');
    
    // Add viewport meta if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=5';
      document.head.appendChild(viewport);
    }

    // Add charset meta if not present
    if (!document.querySelector('meta[charset]')) {
      const charset = document.createElement('meta');
      charset.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charset, document.head.firstChild);
    }

    // Lazy load images that are not in viewport
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach((img) => {
        if (img.getAttribute('src')) return;
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) img.setAttribute('src', dataSrc);
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
      script.async = true;
      document.body.appendChild(script);
    }

  }, []);

  return null;
}
