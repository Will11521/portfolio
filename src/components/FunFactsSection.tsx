import { motion } from 'motion/react';
import { Heart, Coffee, Dog, Music, GraduationCap, Lightbulb } from 'lucide-react';

const facts = [
  {
    icon: Heart,
    text: "I believe in emotionally intelligent design — interfaces should feel like safe spaces.",
    color: "from-rose-400/20 to-pink-400/20"
  },
  {
    icon: GraduationCap,
    text: "I once redesigned my entire portfolio in 72 hours... then did it again. Perfectionism? Absolutely.",
    color: "from-blue-400/20 to-cyan-400/20"
  },
  {
    icon: Dog,
    text: "My golden lab back in India has been with me since she was 20 days old. She's basically family.",
    color: "from-amber-400/20 to-yellow-400/20"
  },
  {
    icon: Coffee,
    text: "I think better with Booster Juice in hand. Brain fuel? Maybe.",
    color: "from-green-400/20 to-emerald-400/20"
  },
  {
    icon: Music,
    text: "Lo-fi + midnight = design zone. That's the rule.",
    color: "from-purple-400/20 to-indigo-400/20"
  },
  {
    icon: Lightbulb,
    text: "I built an AI (Nerve) that knows me better than I know myself. Now that's meta.",
    color: "from-orange-400/20 to-red-400/20"
  }
];

export function FunFactsSection() {
  return (
    <section 
      className="relative min-h-screen py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5F1EB 0%, #E8DED0 100%)' }}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${50 + Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(139, 115, 85, 0.1) 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 
            className="mb-4 text-primary"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: '1.2',
            }}
          >
            Fun Facts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '1.2rem' }}>
            Because life's too short for boring portfolios
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                rotateX: 5,
                scale: 1.05,
              }}
              className={`relative bg-gradient-to-br ${fact.color} backdrop-blur-sm p-6 rounded-2xl border border-primary/10 overflow-hidden group`}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100"
                style={{
                  transform: 'translateZ(20px)',
                }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="relative z-10"
                style={{
                  transform: 'translateZ(30px)',
                }}
              >
                <motion.div
                  className="mb-4 inline-flex p-3 bg-primary/10 rounded-xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <fact.icon className="w-8 h-8 text-primary" />
                </motion.div>

                <p className="text-foreground/80" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {fact.text}
                </p>
              </motion.div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
            </motion.div>
          ))}
        </div>

        {/* Extra personal touch */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.p
            className="text-muted-foreground italic"
            style={{ fontSize: '1.1rem' }}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            I build digital experiences that feel less like work and more like wonder.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
