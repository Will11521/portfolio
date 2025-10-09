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

export default function App() {
  return (
    <>
      <SEO />
      <PerformanceOptimizer />
      <Analytics />
      <ManifestGenerator />
      <SkipNavigation />
      <div className="relative w-full">
        <CustomCursor />
        <ScrollProgress />
        <main role="main">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ResumeSection />
          <FunFactsSection />
          <ContactSection />
        </main>
        <Footer />
        <NerveChatbot />
      </div>
    </>
  );
}
