import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

export type PageKey = 'home' | 'about' | 'portfolio' | 'contact';

const links: { label: string; page: PageKey }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

interface NavigationBarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function NavigationBar({ currentPage, onNavigate }: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [currentPage]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="pointer-events-auto flex items-center justify-between rounded-full border border-primary/10 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-xl">
          <button
            className="flex items-center gap-3 focus:outline-none"
            onClick={() => onNavigate('home')}
            aria-label="Go to home"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-accent/70 text-primary-foreground shadow-md flex items-center justify-center font-semibold">
              WS
            </div>
            <div className="text-left">
              <p
                className="text-xs uppercase tracking-[0.15em] text-primary/70"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Portfolio
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
            {links.map((link) => {
              const isActive = currentPage === link.page;

              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.page)}
                  className="relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md focus:outline-none md:inline-flex"
            >
              Contact
            </button>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:bg-primary/5 focus:outline-none md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto mt-3 rounded-2xl border border-primary/10 bg-white/90 p-4 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col gap-2" aria-label="Mobile navigation">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-primary/10 focus:outline-none"
                    >
                      {link.label}
                      {currentPage === link.page && (
                        <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                      )}
                    </button>
                  </li>
                ))}
                <li className="pt-1">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg focus:outline-none"
                  >
                    Get in Touch
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
