import { motion, useScroll } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Floating scroll percentage */}
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.span 
          className="text-primary"
          style={{ fontSize: '0.85rem' }}
        >
          <motion.span>
            {scrollYProgress.get() ? Math.round(scrollYProgress.get() * 100) : 0}%
          </motion.span>
        </motion.span>
      </motion.div>
    </>
  );
}
