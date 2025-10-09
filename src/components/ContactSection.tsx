import { motion } from 'motion/react';
import { Mail, Linkedin, Github, Calendar, Send, Phone } from 'lucide-react';
import { Button } from './ui/button';

export function ContactSection() {
  return (
    <section 
      id="contact"
      className="relative min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E8DED0 0%, #F5F1EB 100%)' }}
      aria-labelledby="contact-heading"
    >
      {/* Ambient light effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 115, 85, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="text-6xl"
              style={{
                background: 'linear-gradient(135deg, #8B7355 0%, #C4B5A0 50%, #8B7355 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ✦
            </div>
          </motion.div>

          <h2 
            id="contact-heading"
            className="mb-6 text-primary"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: '1.2',
            }}
          >
            Let's Create Something Amazing
          </h2>

          <p className="text-foreground/70 max-w-2xl mx-auto mb-8" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            Prefer a scroll over a scroll bar? Book time with me directly.
          </p>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12 text-muted-foreground"
          >
            <a 
              href="mailto:williamjeetsingh2004@gmail.com"
              className="flex items-center gap-2 hover:text-primary transition-colors"
              style={{ fontSize: '1rem' }}
            >
              <Mail className="w-5 h-5" />
              williamjeetsingh2004@gmail.com
            </a>
            <span className="hidden sm:inline text-primary/30">•</span>
            <a 
              href="tel:+14378721500"
              className="flex items-center gap-2 hover:text-primary transition-colors"
              style={{ fontSize: '1rem' }}
            >
              <Phone className="w-5 h-5" />
              +1 (437) 872-1500
            </a>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-full shadow-lg"
                style={{ fontSize: '1.1rem' }}
                onClick={() => window.open('https://calendly.com/williamjeetsingh2004', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book a Call
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-6 rounded-full"
                style={{ fontSize: '1.1rem' }}
                onClick={() => window.location.href = 'mailto:williamjeetsingh2004@gmail.com'}
              >
                <Send className="w-5 h-5 mr-2" />
                Send Email
              </Button>
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-muted-foreground mb-6" style={{ fontSize: '1rem' }}>
              Or connect with me on
            </p>
            <div className="flex justify-center gap-6">
              {[
                { icon: Mail, href: 'mailto:williamjeetsingh2004@gmail.com', label: 'Email' },
                { icon: Calendar, href: 'https://calendly.com/williamjeetsingh2004', label: 'Book Call' },
                { icon: Linkedin, href: 'https://linkedin.com/in/williamjeetsingh2004', label: 'LinkedIn' },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.2,
                    y: -5,
                  }}
                  className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <social.icon className="w-6 h-6 text-primary" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="pt-12 border-t border-primary/10"
          >
            <p className="text-muted-foreground" style={{ fontSize: '0.95rem' }}>
              © {new Date().getFullYear()} William. Crafted with caffeine & CSS.
            </p>
            <motion.p
              className="text-muted-foreground/60 mt-2"
              style={{ fontSize: '0.85rem' }}
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              Find me on <a href="mailto:williamjeetsingh2004@gmail.com" className="hover:text-primary transition-colors">Email</a> · <a href="https://calendly.com/williamjeetsingh2004" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Book Call</a> · <a href="https://linkedin.com/in/williamjeetsingh2004" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  );
}
