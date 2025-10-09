import { motion } from 'motion/react';
import { Code2, Lightbulb, Rocket, GraduationCap, Target, Zap } from 'lucide-react';

export function ResumeSection() {
  const strengths = [
    {
      icon: Code2,
      label: 'Full-Stack Versatility',
      description: 'React, Next.js, TypeScript, Python, Flask, Node.js & more',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: Lightbulb,
      label: 'Design-First Mindset',
      description: 'Figma prototyping, UI/UX principles, Apple-level polish',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: Rocket,
      label: 'Fast Learner',
      description: 'From concept to deployment, I ship quality products quickly',
      color: 'from-orange-500/20 to-amber-500/20'
    },
    {
      icon: GraduationCap,
      label: 'Continuous Growth',
      description: 'Always exploring new technologies and best practices',
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      icon: Target,
      label: 'Problem Solver',
      description: 'I love tackling complex challenges with creative solutions',
      color: 'from-red-500/20 to-rose-500/20'
    },
    {
      icon: Zap,
      label: 'Attention to Detail',
      description: 'Pixel-perfect implementations with smooth animations',
      color: 'from-indigo-500/20 to-violet-500/20'
    }
  ];

  return (
    <section 
      id="strengths"
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5F1EB 0%, #E8DED0 50%, #F5F1EB 100%)' }}
      aria-labelledby="strengths-heading"
    >
      {/* Background elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            id="strengths-heading"
            className="mb-4 text-primary"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.2
            }}
          >
            What I Bring to Your Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.2rem', lineHeight: 1.7 }}>
            A passionate builder combining technical skills with design thinking, ready to contribute from day one
          </p>
        </motion.div>

        {/* Strengths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {strengths.map((strength, index) => {
            const Icon = strength.icon;
            return (
              <motion.div
                key={strength.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <motion.div 
                  className={`bg-gradient-to-br ${strength.color} backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-500 h-full`}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 
                        className="text-foreground mb-2"
                        style={{ 
                          fontSize: '1.3rem',
                          fontWeight: 600,
                          lineHeight: 1.3
                        }}
                      >
                        {strength.label}
                      </h3>
                      <p className="text-muted-foreground" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {strength.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-12 border border-border">
            <h3 
              className="mb-4 text-primary"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                lineHeight: 1.3
              }}
            >
              Ready to Build Something Great Together?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              I'm actively seeking opportunities where I can grow, contribute, and make an impact. Let's create something amazing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  boxShadow: '0 10px 40px rgba(139, 115, 85, 0.3)'
                }}
              >
                <Rocket className="w-5 h-5" />
                Let's Connect
              </motion.a>
              
              <motion.a
                href="#projects"
                className="inline-flex items-center gap-3 px-8 py-4 bg-card border border-border text-foreground rounded-xl hover:bg-primary/5 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                <Code2 className="w-5 h-5" />
                View My Work
              </motion.a>
            </div>
            
            <p className="text-muted-foreground mt-6" style={{ fontSize: '0.95rem' }}>
              Open to full-time, internship, and freelance opportunities
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
