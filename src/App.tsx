import { useEffect, useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ResumeSection } from './components/ResumeSection';
import { FunFactsSection } from './components/FunFactsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { NerveChatbot } from './components/NerveChatbot';
import { CustomCursor } from './components/CustomCursor';
import { SEO } from './components/SEO';
import { SkipNavigation } from './components/SkipNavigation';
import { PerformanceOptimizer } from './components/PerformanceOptimizer';
import { Analytics } from './components/Analytics';
import { ManifestGenerator } from './components/ManifestGenerator';
import { NavigationBar, PageKey } from './components/NavigationBar';

const allowedPages: PageKey[] = ['home', 'about', 'portfolio', 'contact'];

const parseHashToPage = (): PageKey => {
  if (typeof window === 'undefined') return 'home';
  const hashValue = window.location.hash.replace('#', '').replace('/', '');
  return allowedPages.includes(hashValue as PageKey) ? (hashValue as PageKey) : 'home';
};

export default function App() {
  const [page, setPage] = useState<PageKey>(() => parseHashToPage());

  useEffect(() => {
    const handleHashChange = () => {
      setPage(parseHashToPage());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (target: PageKey) => {
    window.location.hash = target === 'home' ? '' : `/${target}`;
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO />
      <PerformanceOptimizer />
      <Analytics />
      <ManifestGenerator />
      <SkipNavigation />
      <div className="relative w-full">
        <CustomCursor />
        <NavigationBar currentPage={page} onNavigate={navigateToPage} />
        <ScrollProgress />
        <main id="main-content" role="main">
          {page === 'home' && (
            <HeroSection />
          )}

          {page === 'about' && (
            <>
              <AboutSection />
              <SkillsSection />
              <ResumeSection />
              <FunFactsSection />
            </>
          )}

          {page === 'portfolio' && (
            <ProjectsSection />
          )}

          {page === 'contact' && (
            <ContactSection />
          )}
        </main>
        <Footer />
        <NerveChatbot />
      </div>
    </>
  );
}
