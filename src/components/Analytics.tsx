import { useEffect } from 'react';

/**
 * Analytics and performance monitoring
 * Tracks Core Web Vitals for Lighthouse optimization
 */
export function Analytics() {
  useEffect(() => {
    // Report Web Vitals to console (can be replaced with actual analytics service)
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Mark when app becomes interactive
      window.addEventListener('load', () => {
        // Report Time to Interactive
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Page Load Time:', pageLoadTime, 'ms');
        }
      });

      // Observe layout shifts
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (process.env.NODE_ENV === 'development') {
                console.log('Performance Entry:', entry);
              }
            }
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
        } catch (e) {
          // PerformanceObserver not fully supported
        }
      }
    }

    // Preload critical resources
    const preloadFont = (fontUrl: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload critical fonts
    preloadFont('https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.woff2');
    preloadFont('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2');

  }, []);

  return null;
}
