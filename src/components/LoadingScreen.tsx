import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const counter = { value: 0 };
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setHidden(true);
        onComplete();
      },
    });

    timeline
      .to(counter, {
        value: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counter.value)
              .toString()
              .padStart(2, '0')}%`;
          }
        },
      })
      .to(
        [topPanelRef.current, bottomPanelRef.current],
        {
          yPercent: (index) => (index === 0 ? -100 : 100),
          duration: 0.8,
          stagger: 0,
        },
        '+=0.2',
      );

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  if (hidden) {
    return null;
  }

  return (
    <div ref={rootRef} className="loading-screen" aria-hidden="true">
      <div ref={topPanelRef} className="loading-panel" />
      <div ref={bottomPanelRef} className="loading-panel loading-panel-bottom" />
      <div className="loading-copy">
        <span ref={counterRef} className="loading-counter">
          00%
        </span>
        <span className="loading-label">INITIALIZING WILLIAM.DEV</span>
      </div>
    </div>
  );
}
