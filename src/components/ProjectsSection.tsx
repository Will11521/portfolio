import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import dreamSynthImage from 'figma:asset/2f330bddd036cf2d5c3445fa38bf37583f21d4d9.png';
import analyticsImage from 'figma:asset/de470b66222bd4c4058d6410ac42ecc7eaf3144e.png';
import echoLinkImage from 'figma:asset/d395890a254ffe6bc653dd681c99a755400dfe3a.png';
import theSystemImage from 'figma:asset/34ebc99fc30221736308ed1bc3e433a09b577f94.png';

interface Project {
  title: string;
  description: string;
  tech: string[];
  gradient: string;
  icon: string;
  image?: string;
  link?: string;
}

const projects: Project[] = [
  {
    title: "🧠 Analytics Dashboard",
    description: "Real-time merchant insights powered by logic and lore.",
    tech: ["Next.js", "TypeScript", "Recharts", "TailwindCSS"],
    gradient: "from-blue-400/20 to-cyan-400/20",
    icon: "🧠",
    image: analyticsImage,
    link: "https://will11521.github.io/analytics-by-william/"
  },
  {
    title: "🗣 EchoLink",
    description: "Silent communication with AI lip reading + gestures.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    gradient: "from-green-400/20 to-emerald-400/20",
    icon: "🗣",
    image: echoLinkImage,
    link: "https://www.figma.com/proto/qtE2hczc0tLQzhd4pDeMxG/Untitled?node-id=2-37&starting-point-node-id=2%3A37&t=KmthzfmRmQi5DxKm-1"
  },
  {
    title: "🌌 The System",
    description: "Planet-hopping through CSS-based galaxies.",
    tech: ["Vue.js", "Supabase", "Figma", "CSS"],
    gradient: "from-orange-400/20 to-amber-400/20",
    icon: "🌌",
    image: theSystemImage,
    link: "https://will11521.github.io/MidT/"
  },
  {
    title: "🌙 DreamSynth",
    description: "AI-powered dream journaling, emotion tracking & narrated sleep stories.",
    tech: ["React", "Flask", "OpenAI", "D3.js"],
    gradient: "from-purple-400/20 to-pink-400/20",
    icon: "🌙",
    image: dreamSynthImage,
    link: "https://will11521.github.io/dreamsynth-frontend/"
  }
];

export function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6"
      style={{ background: 'linear-gradient(180deg, #F5F1EB 0%, #E8DED0 100%)' }}
      aria-labelledby="projects-heading"
    >
      <motion.div 
        style={{ opacity }}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 
            id="projects-heading"
            className="mb-4 text-primary"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: '1.2',
            }}
          >
            Selected Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.2rem' }}>
            A showcase of projects where creativity meets technical excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative group"
            >
              <motion.div
                className={`relative bg-gradient-to-br ${project.gradient} backdrop-blur-sm rounded-3xl border border-primary/10 overflow-hidden cursor-pointer`}
                whileHover={{ 
                  scale: 1.02,
                  y: -8,
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1] // Apple-style easing
                }}
                onClick={() => project.link && window.open(project.link, '_blank')}
              >
                {/* Soft glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.5 }}
                />

                {/* Project Image */}
                {project.image && (
                  <motion.div 
                    className="relative w-full h-64 overflow-hidden"
                  >
                    <motion.img
                      src={project.image}
                      alt={`${project.title} - Project screenshot`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredIndex === index ? 1.05 : 1,
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </motion.div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <motion.div
                    className="mb-6"
                    style={{ fontSize: '3rem' }}
                    animate={hoveredIndex === index ? {
                      rotateY: [0, 360],
                    } : {}}
                    transition={{ duration: 1 }}
                  >
                    {project.icon}
                  </motion.div>

                  {/* Content */}
                  <motion.div>
                    <h3 className="mb-4 text-primary" style={{ fontSize: '2rem' }}>
                      {project.title}
                    </h3>
                    <p className="text-foreground/70 mb-6" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full"
                          style={{ fontSize: '0.85rem' }}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Hover effect glow */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 rounded-3xl opacity-0 group-hover:opacity-100 -z-10 blur-2xl"
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
