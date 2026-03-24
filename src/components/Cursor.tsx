import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) {
      return;
    }

    const dot = dotRef.current;
    const follower = followerRef.current;

    if (!dot || !follower) {
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;

      gsap.set(follower, {
        x: currentX,
        y: currentY,
        xPercent: -50,
        yPercent: -50,
        opacity: 1,
      });

      rafId = window.requestAnimationFrame(render);
    };

    const handleMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      gsap.set(dot, {
        x: targetX,
        y: targetY,
        xPercent: -50,
        yPercent: -50,
        opacity: 1,
      });
    };

    const handleClick = () => {
      gsap.fromTo(dot, { scale: 1 }, { scale: 0.5, duration: 0.14, yoyo: true, repeat: 1 });
      gsap.fromTo(follower, { scale: 1 }, { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 });
    };

    const magneticElements = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const cleanupHoverHandlers = magneticElements.map((element) => {
      const enter = () => {
        follower.classList.add('is-hovering');
      };

      const leave = () => {
        follower.classList.remove('is-hovering');
      };

      element.addEventListener('mouseenter', enter);
      element.addEventListener('mouseleave', leave);
      element.addEventListener('focus', enter);
      element.addEventListener('blur', leave);

      return () => {
        element.removeEventListener('mouseenter', enter);
        element.removeEventListener('mouseleave', leave);
        element.removeEventListener('focus', enter);
        element.removeEventListener('blur', leave);
      };
    });

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleClick);
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleClick);
      window.cancelAnimationFrame(rafId);
      cleanupHoverHandlers.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
