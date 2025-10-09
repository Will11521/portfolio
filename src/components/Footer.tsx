import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="relative py-12 px-6 border-t border-border/50"
      style={{ background: 'linear-gradient(180deg, #F5F1EB 0%, #E8DED0 100%)' }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          {/* Copyright */}
          <p className="text-muted-foreground flex items-center justify-center gap-2" style={{ fontSize: '0.95rem' }}>
            <span>© {currentYear} Williamjeet Singh.</span>
            <span className="hidden sm:inline">Crafted with</span>
            <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" aria-label="love" />
            <span className="hidden sm:inline">and lots of coffee</span>
          </p>

          {/* Tech Stack Credit */}
          <p className="text-muted-foreground/70" style={{ fontSize: '0.85rem' }}>
            Built with React, TypeScript, Tailwind CSS & Motion
          </p>

          {/* Quick Links */}
          <div className="flex justify-center gap-6 pt-4">
            <a 
              href="#main-content"
              className="text-muted-foreground hover:text-primary transition-colors"
              style={{ fontSize: '0.9rem' }}
            >
              Back to Top ↑
            </a>
            <span className="text-border">•</span>
            <a 
              href="https://github.com/williamjeet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              style={{ fontSize: '0.9rem' }}
            >
              GitHub
            </a>
            <span className="text-border">•</span>
            <a 
              href="https://www.linkedin.com/in/williamjeet-singh/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              style={{ fontSize: '0.9rem' }}
            >
              LinkedIn
            </a>
          </div>

          {/* Fun Easter Egg */}
          <motion.p 
            className="text-muted-foreground/50 pt-4"
            style={{ fontSize: '0.75rem' }}
            whileHover={{ scale: 1.05, color: 'var(--primary)' }}
          >
            Psst... Try the chatbot in the bottom right 👉
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
