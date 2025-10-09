import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Code2, Palette, BarChart3, Brain, Github, Coffee, Sparkles } from 'lucide-react';

const skills = [
  { name: "🌐 HTML5 & CSS3", subtitle: "foundation of every pixel I trust", icon: Code2, level: 95 },
  { name: "🎨 Figma", subtitle: "where chaos meets clean layout", icon: Palette, level: 95 },
  { name: "⚙️ JavaScript + GSAP", subtitle: "breathing motion into the still", icon: Code2, level: 90 },
  { name: "📊 Google Analytics", subtitle: "making sense of the noise", icon: BarChart3, level: 88 },
  { name: "🧠 UX Strategy", subtitle: "designing with empathy (and coffee)", icon: Brain, level: 92 },
  { name: "🧰 GitHub", subtitle: "because version control saves lives", icon: Github, level: 87 },
];

const tools = [
  { name: "Figma", color: "#8B7355" },
  { name: "Canva", color: "#C4B5A0" },
  { name: "Adobe XD", color: "#8B7355" },
  { name: "Looker Studio", color: "#C4B5A0" },
  { name: "GitHub", color: "#8B7355" },
  { name: "Google Tag Manager", color: "#C4B5A0" },
];

export function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E8DED0 0%, #F5F1EB 100%)' }}
      aria-labelledby="skills-heading"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 
            id="skills-heading"
            className="mb-4 text-primary"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: '1.2',
            }}
          >
            Skills & Expertise
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.2rem' }}>
            A blend of design thinking and technical execution
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - 3D Rotating Skill Ring */}
          <div className="relative h-96 flex items-center justify-center">
            <motion.div
              className="relative w-80 h-80"
              style={{
                transformStyle: 'preserve-3d',
                rotateY,
              }}
            >
              {/* Center core */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(139, 115, 85, 0.4)',
                    '0 0 60px rgba(139, 115, 85, 0.6)',
                    '0 0 40px rgba(139, 115, 85, 0.4)',
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              {/* Orbiting skill icons */}
              {skills.map((skill, index) => {
                const angle = (index / skills.length) * Math.PI * 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={skill.name}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate3d(${x}px, 0, ${z}px)`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-card border border-primary/20 flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.2 }}
                    >
                      <skill.icon className="w-8 h-8 text-primary" />
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right - Skills List */}
          <div className="space-y-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-foreground" style={{ fontSize: '1.1rem' }}>
                        {skill.name}
                      </span>
                    </div>
                    <p className="text-muted-foreground/70 italic ml-8" style={{ fontSize: '0.9rem' }}>
                      {skill.subtitle}
                    </p>
                  </div>
                  <span className="text-muted-foreground ml-4" style={{ fontSize: '1rem' }}>
                    {skill.level}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <h3 className="mb-8 text-primary" style={{ fontSize: '2rem' }}>
            Tools I Love
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                }}
                className="px-6 py-3 bg-card rounded-2xl border border-primary/10 shadow-sm"
                style={{
                  borderLeftColor: tool.color,
                  borderLeftWidth: '3px',
                }}
              >
                <span className="text-foreground" style={{ fontSize: '1rem' }}>
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
