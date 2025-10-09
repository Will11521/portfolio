import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section 
      id="main-content"
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F5F1EB 0%, #E8DED0 100%)' }}
      aria-labelledby="hero-heading"
    >
      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Name intro with fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <span 
            className="inline-block text-primary/60"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}
          >
            Williamjeet Singh
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1 
          id="hero-heading"
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            lineHeight: '1.1',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          Designer, Developer,
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Accidental Therapist
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            lineHeight: '1.6',
            fontWeight: 300,
          }}
        >
          Your UI's safe here. So are your emotions.
        </motion.p>

        {/* CTA Section */}
        <motion.div
          className="flex items-center justify-center gap-6 flex-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <motion.button
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full transition-all"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(139, 115, 85, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
              fontWeight: 500,
            }}
            onClick={() => {
              const projectsSection = document.getElementById('projects');
              projectsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Projects
          </motion.button>
          
          <motion.button
            className="px-8 py-4 border-2 border-primary/30 text-primary rounded-full transition-all hover:border-primary/60 hover:bg-primary/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
              fontWeight: 500,
            }}
            onClick={() => {
              const contactSection = document.getElementById('contact');
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get in Touch
          </motion.button>
        </motion.div>

        {/* Location tag */}
        <motion.div
          className="mt-16 text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Based in Ottawa, ON
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1.2 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
          <motion.div 
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{
              y: [0, 16, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
