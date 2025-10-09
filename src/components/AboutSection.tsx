import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E8DED0 0%, #F5F1EB 100%)' }}
      aria-labelledby="about-heading"
    >
      {/* Floating particles background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}</div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
      >
        {/* Left side - Story */}
        <motion.div
          style={{ y }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 
              id="about-heading"
              className="mb-4 text-primary"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: '1.2',
              }}
            >
              Hi, I'm William
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mb-8" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-foreground/80"
            style={{ fontSize: '1.1rem' }}
          >
            I'm William — a designer, developer, and accidental therapist. I build digital experiences that 
            feel like quiet conversations, not flashy lectures. My vibe? Calming interfaces, clever code, 
            and the occasional late-night Figma binge.
          </motion.p>
        </motion.div>

        {/* Right side - Philosophy Cards */}
        <div className="relative">
          <motion.div
            className="space-y-6"
            style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
          >
            {[
              {
                title: "Design Philosophy",
                text: "Every interface tells a story. My goal is to make sure it's one worth experiencing.",
                icon: "✨"
              },
              {
                title: "Technical Approach",
                text: "Clean code, smooth animations, and pixel-perfect execution. No compromises.",
                icon: "⚡"
              },
              {
                title: "Human Touch",
                text: "Behind every screen is a person. I design with empathy, develop with purpose.",
                icon: "🧠"
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 60px rgba(139, 115, 85, 0.2)'
                }}
                className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-primary/10"
                style={{
                  transform: `translateZ(${index * 20}px)`,
                }}
              >
                <div className="mb-4" style={{ fontSize: '2rem' }}>{card.icon}</div>
                <h3 className="mb-3 text-primary" style={{ fontSize: '1.4rem' }}>
                  {card.title}
                </h3>
                <p className="text-foreground/70">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
