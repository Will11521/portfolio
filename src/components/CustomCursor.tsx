import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const rafId = useRef<number>();

  useEffect(() => {
    // Check if device supports hover (not mobile)
    if (!window.matchMedia('(hover: hover)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.classList.contains('cursor-pointer');
      
      isHovering.current = interactive;
    };

    // High-performance animation loop using direct DOM manipulation
    const animate = () => {
      // Update cursor dot instantly
      const cursorScale = isHovering.current ? 1.5 : 1;
      cursor.style.transform = `translate3d(${mousePos.current.x - 6}px, ${mousePos.current.y - 6}px, 0) scale(${cursorScale})`;
      cursor.style.opacity = '1';

      // Smooth follower with lerp
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.15;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.15;
      
      const size = isHovering.current ? 60 : 40;
      const offset = size / 2;
      follower.style.transform = `translate3d(${followerPos.current.x - offset}px, ${followerPos.current.y - offset}px, 0)`;
      follower.style.width = `${size}px`;
      follower.style.height = `${size}px`;
      follower.style.opacity = '1';

      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
}
