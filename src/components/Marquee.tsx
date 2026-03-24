import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
}

export function Marquee({ items, reverse = false }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current) {
      return;
    }

    gsap.set(trackRef.current, { xPercent: reverse ? -50 : 0 });
    gsap.to(trackRef.current, {
      xPercent: reverse ? 0 : -50,
      duration: 24,
      ease: 'none',
      repeat: -1,
    });
  }, [reverse]);

  const marqueeContent = items.map((item, index) => (
    <span key={`${item}-${index}`} className="marquee-item">
      {item}
    </span>
  ));

  return (
    <div className="marquee-viewport" aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        <div className="marquee-group">{marqueeContent}</div>
        <div className="marquee-group">{marqueeContent}</div>
      </div>
    </div>
  );
}
