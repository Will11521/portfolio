import { RefObject, useEffect } from 'react';
import { gsap } from '../lib/gsap';

export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength = 0.24,
  proximity = 80,
) {
  useEffect(() => {
    const el = ref.current;

    if (!el || window.matchMedia('(hover: none)').matches) {
      return;
    }

    let isResting = true;

    const reset = () => {
      if (isResting) {
        return;
      }

      isResting = true;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
        overwrite: true,
      });
    };

    const handleMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const threshold = Math.max(rect.width, rect.height) / 2 + proximity;

      if (distance < threshold) {
        isResting = false;
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
        });
      } else {
        reset();
      }
    };

    window.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
    el.addEventListener('blur', reset as EventListener);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', reset);
      el.removeEventListener('blur', reset as EventListener);
    };
  }, [proximity, ref, strength]);
}
