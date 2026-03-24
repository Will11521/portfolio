import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ 
  title = 'Williamjeet Singh - Design Meets Data | Web Developer & GTM Specialist',
  description = 'Portfolio of Williamjeet Singh, a web developer and GTM specialist focused on UX, SEO, visual intelligence, AI, and analytics-driven digital experiences.',
  image = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
  url = 'https://williamdev.is-a.dev'
}: SEOProps) {
  
  useEffect(() => {
    // Update title
    document.title = title;
    document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
    document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.remove();
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'author', content: 'Williamjeet Singh' },
      { name: 'keywords', content: 'Williamjeet Singh, web developer, GTM specialist, UX, SEO, AI, analytics, digital marketing, portfolio' },
      
      // Open Graph / Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      
      // Mobile optimization
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
      { name: 'theme-color', content: '#8B7355' },
      { name: 'mobile-web-app-capable', content: 'yes' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add structured data for rich results
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Williamjeet Singh',
      alternateName: 'William Singh',
      jobTitle: 'Web Developer & GTM Specialist',
      url: url,
      sameAs: [
        'https://www.linkedin.com/in/williamjeetsingh2004',
        'https://github.com/Will11521'
      ],
      description: description,
      image: image,
      knowsAbout: [
        'Web Development',
        'UI/UX Design',
        'SEO',
        'Google Tag Manager',
        'Artificial Intelligence',
        'Analytics',
        'React',
        'Next.js',
        'Python',
        'Figma'
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Web Developer',
        skills: 'Web Development, GTM, SEO, UX, Python, Analytics, Figma'
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, image, url]);

  return null;
}
