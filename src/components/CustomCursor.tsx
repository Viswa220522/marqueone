'use client';

import { useEffect, useRef } from 'react';
import { GlassCard } from '@developer-hub/liquid-glass';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const magnifyRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const currentScale = useRef(1);
  const opacity = useRef(1);
  const currentOpacity = useRef(0);
  const isClicked = useRef(false);
  const visible = useRef(false);
  const rafId = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const setLensEffect = (options: {
    blendMode: 'difference' | 'exclusion';
    filter: string;
    magnifyScale: number;
    magnifyOpacity: number;
    highlightOpacity: number;
  }) => {
    if (highlightRef.current) {
      highlightRef.current.style.opacity = String(options.highlightOpacity);
    }

    if (lensRef.current) {
      lensRef.current.style.mixBlendMode = options.blendMode;
      lensRef.current.style.filter = options.filter;
    }

    if (magnifyRef.current) {
      magnifyRef.current.style.transform = `scale(${options.magnifyScale})`;
      magnifyRef.current.style.opacity = String(options.magnifyOpacity);
    }
  };

  useEffect(() => {
    // Disable on touch / mobile
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) return;

    // Hide default cursor globally
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!visible.current) visible.current = true;
    };

    const handleMouseLeave = () => {
      visible.current = false;
    };

    const handleMouseEnter = () => {
      visible.current = true;
    };

    const handleMouseDown = () => {
      isClicked.current = true;
    };

    const handleMouseUp = () => {
      isClicked.current = false;
    };

    const animateCursor = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.12);

      const targetScale = isClicked.current ? scale.current * 0.9 : scale.current;
      currentScale.current = lerp(currentScale.current, targetScale, 0.15);

      const targetOpacity = visible.current ? opacity.current : 0;
      currentOpacity.current = lerp(currentOpacity.current, targetOpacity, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${currentScale.current})`;
        cursorRef.current.style.opacity = String(currentOpacity.current);
      }

      rafId.current = requestAnimationFrame(animateCursor);
    };

    // Hover detection via event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const navItem = target.closest('.nav-item');
      const clickable = target.closest(
        'a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]'
      );
      const card = target.closest(
        '.glass-card, [data-cursor-card]'
      );

      // System awareness: If hovering over a nav item (which now has its own liquid glass)
      if (navItem) {
        scale.current = 1.05;
        setLensEffect({
          blendMode: 'difference',
          filter: 'url(#cursor-glass-distortion) brightness(1.16) contrast(1.1) saturate(1.1)',
          magnifyScale: 1.11,
          magnifyOpacity: 0.82,
          highlightOpacity: 1,
        });
      } else if (clickable) {
        scale.current = 1.18;
        setLensEffect({
          blendMode: 'difference',
          filter: 'url(#cursor-glass-distortion) brightness(1.14) contrast(1.08) saturate(1.08)',
          magnifyScale: 1.09,
          magnifyOpacity: 0.78,
          highlightOpacity: 1,
        });
      } else if (card) {
        scale.current = 1.2;
        setLensEffect({
          blendMode: 'exclusion',
          filter: 'url(#cursor-glass-distortion) brightness(1.1) contrast(1.05) saturate(1.05)',
          magnifyScale: 1.07,
          magnifyOpacity: 0.72,
          highlightOpacity: 0.8,
        });
      } else {
        scale.current = 1;
        setLensEffect({
          blendMode: 'exclusion',
          filter: 'url(#cursor-glass-distortion) brightness(1.03) contrast(1.02) saturate(1.02)',
          magnifyScale: 1.03,
          magnifyOpacity: 0.58,
          highlightOpacity: 0.5,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Start animation loop
    rafId.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId.current);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '32px',
        height: '32px',
        pointerEvents: 'none',
        zIndex: 100000,
        willChange: 'transform, opacity',
        opacity: 0,
        borderRadius: '50%',
        // Restore visibility styling
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="cursor-glass-distortion" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves="1"
              seed="7"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <GlassCard 
        cornerRadius={9999} 
        blurAmount={8} 
        displacementScale={3} 
        padding="0"
        style={{ width: '100%', height: '100%', margin: 0, padding: 0, borderRadius: '50%' }}
      >
        <div
          ref={lensRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(8px) saturate(180%)',
            WebkitBackdropFilter: 'blur(8px) saturate(180%)',
            mixBlendMode: 'exclusion',
            filter: 'url(#cursor-glass-distortion) brightness(1.03) contrast(1.02) saturate(1.02)',
            transition: 'filter 0.34s cubic-bezier(0.4, 0, 0.2, 1), mix-blend-mode 0.34s cubic-bezier(0.4, 0, 0.2, 1), background 0.34s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            ref={magnifyRef}
            style={{
              position: 'absolute',
              inset: '-10%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 34%, rgba(255, 255, 255, 0) 70%)',
              transform: 'scale(1.02)',
              transformOrigin: 'center',
              opacity: 0.58,
              transition: 'transform 0.34s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.34s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <div 
            ref={highlightRef}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 36%, rgba(255, 255, 255, 0) 62%)',
              transition: 'opacity 0.3s ease',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '2px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.14), inset 0 -3px 8px rgba(0, 0, 0, 0.18)',
            }}
          />
        </div>
      </GlassCard>
    </div>
  );
}
