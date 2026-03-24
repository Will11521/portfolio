import { useEffect, useRef, useState } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  ChevronDown,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  CalendarDays,
} from 'lucide-react';
import { NerveChatbot } from './components/NerveChatbot';
import { Cursor } from './components/Cursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Marquee } from './components/Marquee';
import { SEO } from './components/SEO';
import { SkipNavigation } from './components/SkipNavigation';
import { PerformanceOptimizer } from './components/PerformanceOptimizer';
import { Analytics } from './components/Analytics';
import { ManifestGenerator } from './components/ManifestGenerator';
import { gsap, ScrollTrigger } from './lib/gsap';
import { GLSLHills } from './components/ui/glsl-hills';

const ABOUT_SKILLS = [
  {
    title: 'AI & Analytics',
    items: ['Artificial Intelligence', 'Google Analytics', 'GTM', 'Business Analytics'],
  },
  {
    title: 'Web & UX',
    items: ['Web Development', 'UX Research', 'User Experience Design', 'SEO'],
  },
  {
    title: 'Content & Design',
    items: ['Digital Marketing', 'Graphic Design', 'Content Writing', 'Visual Intelligence'],
  },
];

const WHAT_I_DO = [
  {
    title: 'WEB DEVELOPMENT',
    icon: '</>',
    copy: 'I build fast, scalable web apps — Next.js, React, responsive, accessible.',
    tags: ['Next.js', 'React', 'TypeScript', 'REST APIs'],
  },
  {
    title: 'UX DESIGN',
    icon: '◎',
    copy: 'User-first, research-backed design. Wireframes to high-fidelity in Figma.',
    tags: ['Figma', 'Prototyping', 'UX Research', 'Design Systems'],
  },
  {
    title: 'GTM & ANALYTICS',
    icon: '↗',
    copy: 'I instrument the web — Google Tag Manager, GA4, Looker Studio dashboards.',
    tags: ['GTM', 'GA4', 'Looker Studio', 'SEO'],
  },
  {
    title: 'AI & AUTOMATION',
    icon: '⬡',
    copy: 'Built AI-driven BI tools — sales pattern recognition, emotional tone analysis.',
    tags: ['Python', 'Flask', 'TextBlob', 'NLP'],
  },
  {
    title: 'BRANDING & CONTENT',
    icon: '✦',
    copy: 'Boosted engagement 30% through branded social content for a fitness brand.',
    tags: ['Canva', 'Instagram', 'Facebook', 'Strategy'],
  },
];

const TIMELINE = [
  {
    period: 'Sep 2025 - Present',
    role: 'Manager of Sales — WirelessPlus',
    details: [
      'Diagnose and repair smartphones including screen replacements, battery replacements, charging ports, and hardware issues',
      'Configure devices, perform data transfers, and troubleshoot software and connectivity problems',
      'Sell and activate smartphones, wireless plans, and accessories',
      'Manage transactions, inventory, and customer service in a fast-paced retail environment',
    ],
  },
  {
    period: 'Mar 2024 - Dec 2025',
    role: 'Shift Lead — Booster Juice',
    details: [
      'Led a team of up to 6 staff during peak operations, ensuring smooth workflow and exceptional customer service',
      'Fostered clear communication and resolved issues quickly to maintain productivity',
      'Developed leadership, multitasking and conflict-resolution skills in a fast-paced environment',
    ],
  },
  {
    period: 'Mar 2025 - May 2025',
    role: 'AI Intern — Square Root Technologies Inc.',
    details: [
      'Collaborated with the team to develop an AI-driven business intelligence tool',
      'Created front-end UI prototypes and interactive dashboards for internal analytics',
      'Integrated insights from external BI platforms into tailored solutions',
      'Assisted with insight automation, sales pattern recognition and emotion analysis using Python, Flask and TextBlob',
      'Focused on designing seamless user flows for complex AI outputs',
    ],
  },
  {
    period: 'Mar 2024 - Jun 2024',
    role: 'Social Media Manager — Brazily Fitness Inc.',
    details: [
      'Managed Instagram and Facebook channels, planning and scheduling posts using Canva',
      'Developed themed content campaigns that boosted engagement by 30%',
      'Collaborated directly with the founder to maintain a consistent brand voice and respond to audience feedback',
    ],
  },
];

const PROJECTS = [
  {
    title: '🧠 Analytics Dashboard',
    stack: ['Next.js', 'TypeScript', 'Recharts', 'TailwindCSS'],
    description:
      'Real-time merchant insights powered by logic and lore.',
    image: '/images/project-ai.jpg',
    link: 'https://will11521.github.io/analytics-by-william/',
  },
  {
    title: '🗣 EchoLink',
    stack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    description:
      'Silent communication with AI lip reading + gestures.',
    image: '/images/project-echolink.png',
    link: 'https://www.figma.com/proto/qtE2hczc0tLQzhd4pDeMxG/Untitled?node-id=2-37&starting-point-node-id=2%3A37',
  },
  {
    title: '🌌 The System',
    stack: ['Vue.js', 'Supabase', 'Figma', 'CSS'],
    description:
      'Planet-hopping through CSS-based galaxies.',
    image: '/images/project-social.jpg',
    link: 'https://will11521.github.io/MidT/',
  },
  {
    title: '🌙 DreamSynth',
    stack: ['React', 'Flask', 'OpenAI', 'D3.js'],
    description:
      'AI-powered dream journaling, emotion tracking & narrated sleep stories.',
    image: '/images/hero-bg-2.jpg',
    link: 'https://dreamsynth.live/',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Working with William was smooth from start to finish. Clear communication and a design that nailed exactly what I envisioned.',
    source: 'Client, Portfolio Website',
  },
  {
    quote:
      'He interpreted my designs perfectly for a professional set of webpages. Truly great work and a pleasure to work with.',
    source: 'Client, Web Project',
  },
  {
    quote:
      'William delivered a simple, clean design that completely met my requirements. The final version was exactly what I expected.',
    source: 'Client, Personal Website',
  },
];

const MARQUEE_ITEMS = [
  'WEB DEVELOPMENT',
  'UX DESIGN',
  'GOOGLE TAG MANAGER',
  'NEXT.JS',
  'FIGMA',
  'PYTHON',
  'FLASK',
  'AI / ML',
  'LOOKER STUDIO',
  'SEO',
  'REACT',
  'GSAP',
];

function scrollToId(target: string) {
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function DualTextNavItem({ label, target }: { label: string; target: string }) {
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);

  const animateIn = () => {
    gsap.to(topRef.current, { yPercent: -100, duration: 0.35, ease: 'power3.out', overwrite: true });
    gsap.to(bottomRef.current, { yPercent: 0, duration: 0.35, ease: 'power3.out', overwrite: true });
  };

  const animateOut = () => {
    gsap.to(topRef.current, { yPercent: 0, duration: 0.35, ease: 'power3.out', overwrite: true });
    gsap.to(bottomRef.current, { yPercent: 100, duration: 0.35, ease: 'power3.out', overwrite: true });
  };

  return (
    <button
      type="button"
      className="nav-link"
      data-magnetic
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      onFocus={animateIn}
      onBlur={animateOut}
      onClick={() => scrollToId(target)}
    >
      <span className="nav-link-track">
        <span ref={topRef} className="nav-link-layer">
          {label}
        </span>
        <span ref={bottomRef} className="nav-link-layer nav-link-layer-bottom">
          {label}
        </span>
      </span>
    </button>
  );
}

function MagneticButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button className={className} data-magnetic {...props}>
      {children}
    </button>
  );
}

function MagneticLink({
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a className={className} data-magnetic {...props}>
      {children}
    </a>
  );
}

function ProjectCard({
  title,
  client,
  stack,
  description,
  image,
  link,
}: (typeof PROJECTS)[number]) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleEnter = () => {
    gsap.to(imageRef.current, { scale: 1.08, duration: 0.45, ease: 'power2.out', overwrite: true });
    gsap.to(overlayRef.current, { yPercent: 0, duration: 0.45, ease: 'power2.out', overwrite: true });
    gsap.to(cardRef.current, {
      boxShadow: '0 0 0 1px rgba(200, 255, 0, 0.9), 0 28px 80px rgba(0, 0, 0, 0.45)',
      duration: 0.45,
      overwrite: true,
    });
  };

  const handleLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.45, ease: 'power2.out', overwrite: true });
    gsap.to(overlayRef.current, { yPercent: 100, duration: 0.45, ease: 'power2.out', overwrite: true });
    gsap.to(cardRef.current, {
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.08)',
      duration: 0.45,
      overwrite: true,
    });
  };

  return (
    <a
      ref={cardRef}
      className="project-card"
      href={link}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      data-reveal
    >
      <div className="project-media">
        <img ref={imageRef} src={image} alt={title} />
        <div ref={overlayRef} className="project-overlay">
          <p>{description}</p>
        </div>
      </div>
      <div className="project-meta">
        <div className="project-header">
          <h3>{title}</h3>
          {client ? <span>{client}</span> : null}
        </div>
        <div className="tag-list">
          {stack.map((item) => (
            <span key={item} className="tag-pill">
              {item}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const timelineDetailsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [showLoader, setShowLoader] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null);

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem('william-loader-seen');

    if (hasSeenLoader) {
      setIsReady(true);
      return;
    }

    setShowLoader(true);
  }, []);

  useGSAP(
    () => {
      const heroChars = gsap.utils.toArray<HTMLElement>('.hero-char');
      const subtitle = document.querySelector('.hero-panel-primary .hero-subtitle');
      const actions = document.querySelector('.hero-actions');
      const scrollIndicator = document.querySelector('.scroll-indicator');
      const heroPrimaryPanel = document.querySelector('.hero-panel-primary');
      const heroSecondaryPanel = document.querySelector('.hero-panel-secondary');
      const heroBackground = document.querySelector('.hero-horizon');
      const sectionReveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      const counters = gsap.utils.toArray<HTMLElement>('[data-counter]');
      const aboutCards = gsap.utils.toArray<HTMLElement>('.stack-card');
      const timelineItems = gsap.utils.toArray<HTMLElement>('.timeline-item');
      const testimonialCards = gsap.utils.toArray<HTMLElement>('.testimonial-card');

      const heroTimeline = gsap.timeline({ paused: true });
      heroTimeline
        .fromTo(
          heroChars,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.04,
            duration: 0.8,
            ease: 'power3.out',
          },
        )
        .fromTo(
          subtitle,
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.2',
        )
        .fromTo(
          actions,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.15',
        )
        .fromTo(
          scrollIndicator,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.2',
        );

      if (isReady) {
        heroTimeline.play(0);
      }

      if (heroPrimaryPanel && heroSecondaryPanel && heroBackground) {
        gsap.set(heroSecondaryPanel, { opacity: 0, y: 80 });

        const heroScrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });

        heroScrollTimeline
          .to(
            heroPrimaryPanel,
            {
              yPercent: -18,
              opacity: 0,
              ease: 'none',
            },
            0,
          )
          .to(
            heroBackground,
            {
              scale: 1.08,
              filter: 'brightness(1.05)',
              ease: 'none',
            },
            0,
          )
          .to(
            heroSecondaryPanel,
            {
              y: 0,
              opacity: 1,
              ease: 'none',
            },
            0.25,
          )
          .to(
            heroSecondaryPanel,
            {
              yPercent: -10,
              opacity: 0,
              ease: 'none',
            },
            0.76,
          )
          .to(
            scrollIndicator,
            {
              opacity: 0,
              y: 24,
              ease: 'none',
            },
            0.7,
          );
      }

      ScrollTrigger.create({
        start: 100,
        end: 99999,
        onEnter: () =>
          gsap.to(navRef.current, {
            backgroundColor: 'rgba(8, 8, 8, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            duration: 0.3,
          }),
        onLeaveBack: () =>
          gsap.to(navRef.current, {
            backgroundColor: 'rgba(8, 8, 8, 0)',
            borderColor: 'rgba(255, 255, 255, 0)',
            backdropFilter: 'blur(0px)',
            duration: 0.3,
          }),
      });

      sectionReveals.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
            },
          },
        );
      });

      gsap.fromTo(
        aboutCards,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-card-stack',
            start: 'top 80%',
          },
        },
      );

      counters.forEach((counter) => {
        const target = Number(counter.dataset.target ?? '0');
        const pad = Number(counter.dataset.pad ?? '0');
        const value = { count: 0 };

        gsap.to(value, {
          count: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            counter.textContent = Math.round(value.count)
              .toString()
              .padStart(pad, '0');
          },
        });
      });

      timelineItems.forEach((item) => {
        const dot = item.querySelector('.timeline-dot');
        const line = item.querySelector('.timeline-line-fill');
        const panel = item.querySelector('.timeline-panel');

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
        });

        timeline
          .fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.8)' })
          .fromTo(
            line,
            { scaleY: 0, transformOrigin: 'top center' },
            { scaleY: 1, duration: 0.55, ease: 'power2.out' },
            '-=0.05',
          )
          .fromTo(panel, { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.2');
      });

      gsap.fromTo(
        testimonialCards,
        { rotateY: 90, opacity: 0, transformPerspective: 1200, transformOrigin: 'left center' },
        {
          rotateY: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testimonials-row',
            start: 'top 82%',
          },
        },
      );
    },
    { scope: rootRef, dependencies: [isReady] },
  );

  useEffect(() => {
    timelineDetailsRef.current.forEach((panel, index) => {
      if (!panel) {
        return;
      }

      gsap.to(panel, {
        height: activeTimeline === index ? 'auto' : 0,
        opacity: activeTimeline === index ? 1 : 0,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
    });
  }, [activeTimeline]);

  const finishLoading = () => {
    sessionStorage.setItem('william-loader-seen', 'true');
    setShowLoader(false);
    setIsReady(true);
  };

  return (
    <>
      <SEO />
      <PerformanceOptimizer />
      <Analytics />
      <ManifestGenerator />
      <SkipNavigation />
      <div ref={rootRef} className="portfolio-shell">
        <Cursor />
        {showLoader ? <LoadingScreen onComplete={finishLoading} /> : null}
        <div className="film-grain" aria-hidden="true" />
        <header ref={navRef} className="site-nav">
          <button type="button" className="logo-mark" onClick={() => scrollToId('#hero')}>
            W.
          </button>
          <nav className="site-nav-links" aria-label="Primary">
            <DualTextNavItem label="About" target="#about" />
            <DualTextNavItem label="Work" target="#work" />
            <DualTextNavItem label="Contact" target="#contact" />
          </nav>
          <div className="availability-badge">
            <span className="availability-dot" />
            Available for work
          </div>
        </header>
        <main id="main-content" role="main">
          <div id="smooth-wrapper">
            <div id="smooth-content">
              <section id="hero" className="hero-section">
                <div className="hero-stage">
                  <GLSLHills className="hero-horizon" cameraZ={120} planeSize={240} speed={0.35}>
                    <div className="hero-copy">
                      <div className="hero-panel hero-panel-primary">
                        <div className="hero-copy-block">
                          <span className="section-label hero-eyebrow">
                            NEPEAN, ON — INTERACTIVE MEDIA DESIGN
                          </span>
                          <h1 className="hero-title" aria-label="Williamjeet Singh">
                            <span className="hero-line">
                              {'WILLIAMJEET'.split('').map((char, index) => (
                                <span key={`first-${char}-${index}`} className="hero-char-wrap">
                                  <span className="hero-char">{char}</span>
                                </span>
                              ))}
                            </span>
                            <span className="hero-line">
                              {'SINGH'.split('').map((char, index) => (
                                <span key={`second-${char}-${index}`} className="hero-char-wrap">
                                  <span className="hero-char">{char}</span>
                                </span>
                              ))}
                            </span>
                          </h1>
                          <p className="hero-subtitle">
                            Design Meets Data | Web Developer &amp; GTM Specialist | UX, SEO &amp; Visual Intelligence
                          </p>
                          <div className="hero-actions">
                            <MagneticButton className="cta-button cta-primary" onClick={() => scrollToId('#projects')}>
                              <span>View My Work</span>
                              <ArrowUpRight size={18} />
                            </MagneticButton>
                            <MagneticButton className="cta-button cta-secondary" onClick={() => scrollToId('#contact')}>
                              <span>Get In Touch</span>
                              <ArrowUpRight size={18} />
                            </MagneticButton>
                          </div>
                        </div>
                      </div>
                      <div className="hero-panel hero-panel-secondary">
                        <span className="section-label">INTRO</span>
                        <h2 className="hero-secondary-title">I Build Things That Think.</h2>
                        <p className="hero-secondary-copy">
                          Web development, AI systems, GTM, SEO, and visual intelligence shaped into
                          experiences that feel human before they feel technical.
                        </p>
                        <div className="hero-secondary-meta">
                          <span className="tag-pill">Python</span>
                          <span className="tag-pill">Flask</span>
                          <span className="tag-pill">GPT</span>
                          <span className="tag-pill">Analytics</span>
                          <span className="tag-pill">UX</span>
                        </div>
                      </div>
                    </div>
                  </GLSLHills>
                  <button type="button" className="scroll-indicator" onClick={() => scrollToId('#about')}>
                    <span>SCROLL</span>
                    <ChevronDown size={18} />
                  </button>
                  <div className="hero-end-caption">
                    <span>Scroll through the opening sequence</span>
                  </div>
                </div>
              </section>

              <section id="about" className="section about-section">
                <div className="section-inner about-grid" data-reveal>
                  <div className="about-copy">
                    <span className="section-label">ABOUT ME</span>
                    <h2 className="section-title">I Build Things That Think.</h2>
                    <p className="section-body">
                      My work sits at the point where AI, design, and code start to feel alive. I use
                      tools like Python, Flask, GPT, JavaScript, and analytics systems to create
                      interfaces and experiences that understand people — not just respond to them.
                      I&apos;m obsessed with how data can show emotion, how interfaces can predict
                      behavior, and how AI can quietly improve the way we work or feel online. My
                      toolkit covers web development, UX, data visualization, GTM and SEO, but my
                      real skill is connecting logic with intuition — turning raw systems into
                      something that feels intelligent.
                    </p>
                  </div>
                  <div className="about-card-stack">
                    {ABOUT_SKILLS.map((group) => (
                      <article key={group.title} className="stack-card">
                        <header>
                          <span className="stack-card-label">{group.title}</span>
                        </header>
                        <div className="tag-list">
                          {group.items.map((item) => (
                            <span key={item} className="tag-pill">
                              {item}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="section-inner stats-grid">
                  {[
                    { target: 2, pad: 2, label: 'Years of Experience' },
                    { target: 15, pad: 2, label: 'Projects Completed' },
                    { target: 10, pad: 2, label: 'Happy Clients' },
                  ].map((stat) => (
                    <div key={stat.label} className="stat-card" data-reveal>
                      <div className="stat-value">
                        <span data-counter data-target={stat.target} data-pad={stat.pad}>
                          00
                        </span>
                        <span>+</span>
                      </div>
                      <p>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="work" className="section what-i-do-section">
                <div className="what-i-do-heading">
                  <span className="section-label">WHAT I DO</span>
                </div>
                <div className="what-i-do-track" data-reveal>
                  {WHAT_I_DO.map((item, index) => (
                    <article key={item.title} className="what-card" data-number={`0${index + 1}`}>
                      <div className="what-card-top">
                        <span className="what-serial">{`0${index + 1}`}</span>
                        <span className="what-icon">{item.icon}</span>
                      </div>
                      <div className="what-card-copy">
                        <span className="what-kicker">Capability</span>
                        <h2>{item.title}</h2>
                        <p>{item.copy}</p>
                        <div className="tag-list">
                          {item.tags.map((tag) => (
                            <span key={tag} className="tag-pill">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section id="journey" className="section journey-section">
                <div className="section-inner">
                  <div className="section-heading" data-reveal>
                    <span className="section-label">MY JOURNEY</span>
                    <h2 className="section-title">Built Through Motion, Research, and Systems.</h2>
                  </div>
                  <div className="timeline">
                    {TIMELINE.map((item, index) => (
                      <article
                        key={`${item.period}-${item.role}`}
                        className="timeline-item"
                        data-reveal
                        onMouseEnter={() => setActiveTimeline(index)}
                        onMouseLeave={() => setActiveTimeline(null)}
                        onFocus={() => setActiveTimeline(index)}
                        onBlur={() => setActiveTimeline(null)}
                        onClick={() => setActiveTimeline(activeTimeline === index ? null : index)}
                        tabIndex={0}
                      >
                        <div className="timeline-rail">
                          <span className="timeline-dot" />
                          <span className="timeline-line">
                            <span className="timeline-line-fill" />
                          </span>
                        </div>
                        <div className="timeline-panel">
                          <span className="timeline-period">{item.period}</span>
                          <h3>{item.role}</h3>
                          <div
                            ref={(element) => {
                              timelineDetailsRef.current[index] = element;
                            }}
                            className="timeline-detail"
                          >
                            <ul className="timeline-detail-list">
                              {item.details.map((detail) => (
                                <li key={detail}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section id="projects" className="section projects-section">
                <div className="section-inner">
                  <div className="section-heading" data-reveal>
                    <span className="section-label">SELECTED WORK</span>
                    <h2 className="section-title section-title-xl">Selected Work</h2>
                  </div>
                  <div className="projects-grid">
                    {PROJECTS.map((project) => (
                      <ProjectCard key={project.title} {...project} />
                    ))}
                  </div>
                </div>
              </section>

              <section className="section testimonials-section">
                <div className="section-inner">
                  <div className="section-heading" data-reveal>
                    <span className="section-label">WHAT THEY SAID</span>
                    <h2 className="section-title">Voices Behind the Build.</h2>
                  </div>
                  <div className="testimonials-row">
                    {TESTIMONIALS.map((item) => (
                      <article key={item.source} className="testimonial-card">
                        <p>&ldquo;{item.quote}&rdquo;</p>
                        <span>{item.source}</span>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <section className="section marquee-section" data-reveal>
                <Marquee items={MARQUEE_ITEMS} />
                <Marquee items={MARQUEE_ITEMS} reverse />
              </section>

              <section id="contact" className="section contact-section">
                <div className="section-inner contact-layout" data-reveal>
                  <div className="contact-copy">
                    <span className="section-label">CONTACT</span>
                    <h2 className="contact-title">
                      <span>LET&apos;S BUILD</span>
                      <span>SOMETHING</span>
                      <span>GREAT.</span>
                    </h2>
                    <p className="section-body">
                      Available for freelance work and collaborations.
                    </p>
                  </div>
                  <div className="contact-panel">
                    <div className="contact-links">
                      <MagneticLink className="contact-link" href="mailto:williamjeetsingh2004@gmail.com">
                        <Mail size={18} />
                        <span>williamjeetsingh2004@gmail.com</span>
                      </MagneticLink>
                      <MagneticLink
                        className="contact-link"
                        href="https://www.linkedin.com/in/williamjeetsingh2004"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Linkedin size={18} />
                        <span>linkedin.com/in/williamjeetsingh2004</span>
                      </MagneticLink>
                      <div className="contact-link contact-link-static">
                        <MapPin size={18} />
                        <span>Nepean, Ontario, Canada</span>
                      </div>
                      <MagneticLink
                        className="contact-link"
                        href="https://calendly.com/williamjeetsingh2004"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <CalendarDays size={18} />
                        <span>Book on Calendly</span>
                      </MagneticLink>
                    </div>
                    <div className="social-row">
                      <MagneticLink
                        className="social-link"
                        href="https://github.com/Will11521"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Github size={18} />
                        <span>GitHub</span>
                      </MagneticLink>
                      <MagneticLink
                        className="social-link"
                        href="https://www.instagram.com/i__william/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Instagram size={18} />
                        <span>Instagram</span>
                      </MagneticLink>
                    </div>
                  </div>
                </div>
                <div className="section-inner footer-bar">
                  <span>© 2025 Williamjeet Singh</span>
                  <div className="footer-meta">
                    <span>Designed &amp; Built with intention.</span>
                    <MagneticButton className="back-to-top" onClick={() => scrollToId('#hero')}>
                      <span>↑</span>
                    </MagneticButton>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
        <NerveChatbot />
      </div>
    </>
  );
}
