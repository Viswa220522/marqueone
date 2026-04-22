'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { GlassCard } from '@developer-hub/liquid-glass';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Garage', href: '#garage' },
  { label: 'Motor Club', href: '#motorclub' },
  { label: 'Lifestyle', href: '#lifestyle' },
  { label: 'Contact', href: '#contact' },
];

type NavPillRect = {
  x: number;
  top: number;
  width: number;
  height: number;
};

const pillEase: [number, number, number, number] = [0.4, 0, 0.2, 1];
const moveEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSurfaceWidth, setNavSurfaceWidth] = useState(0);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navSurfaceRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pillControls = useAnimationControls();
  const currentPillRectRef = useRef<NavPillRect | null>(null);
  const animationIdRef = useRef(0);

  const getPillRect = (target: HTMLElement): NavPillRect | null => {
    const container = navContainerRef.current;
    if (!container) return null;

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: targetRect.left - containerRect.left,
      top: targetRect.top - containerRect.top,
      width: targetRect.width,
      height: targetRect.height,
    };
  };

  const animatePillTo = async (nextRect: NavPillRect) => {
    const currentRect = currentPillRectRef.current;
    const animationId = ++animationIdRef.current;

    pillControls.stop();

    if (
      currentRect &&
      currentRect.x === nextRect.x &&
      currentRect.top === nextRect.top &&
      currentRect.width === nextRect.width &&
      currentRect.height === nextRect.height
    ) {
      await pillControls.start({
        opacity: 1,
        scaleX: 1,
        borderRadius: '999px',
        transition: { duration: 0.2, ease: 'easeOut' },
      });
      return;
    }

    if (!currentRect) {
      const circleSize = nextRect.height;
      const circleX = nextRect.x + (nextRect.width - circleSize) / 2;

      pillControls.set({
        x: circleX,
        top: nextRect.top,
        width: circleSize,
        height: circleSize,
        opacity: 0,
        scaleX: 0.94,
        borderRadius: '50%',
      });

      await pillControls.start({
        opacity: 1,
        scaleX: 1,
        transition: { duration: 0.18, ease: pillEase },
      });

      if (animationId !== animationIdRef.current) return;

      await pillControls.start({
        x: nextRect.x,
        top: nextRect.top,
        width: nextRect.width,
        height: nextRect.height,
        opacity: 1,
        scaleX: 1,
        borderRadius: '999px',
        transition: { duration: 0.24, ease: 'easeOut' },
      });

      if (animationId !== animationIdRef.current) return;
      currentPillRectRef.current = nextRect;
      return;
    }

    const circleSize = Math.min(currentRect.height, nextRect.height);
    const currentCircleX = currentRect.x + (currentRect.width - circleSize) / 2;
    const nextCircleX = nextRect.x + (nextRect.width - circleSize) / 2;
    const currentCircleTop = currentRect.top + (currentRect.height - circleSize) / 2;
    const nextCircleTop = nextRect.top + (nextRect.height - circleSize) / 2;
    const travelDistance = Math.abs(nextCircleX - currentCircleX);
    const moveDuration = Math.min(0.45, Math.max(0.3, 0.3 + travelDistance * 0.00035));

    await pillControls.start({
      x: currentCircleX,
      top: currentCircleTop,
      width: circleSize,
      height: circleSize,
      opacity: 1,
      scaleX: 1,
      borderRadius: '50%',
      transition: { duration: 0.2, ease: pillEase },
    });

    if (animationId !== animationIdRef.current) return;

    await pillControls.start({
      x: nextCircleX,
      top: nextCircleTop,
      width: circleSize,
      height: circleSize,
      opacity: 1,
      scaleX: 1.04,
      borderRadius: '50%',
      transition: { duration: moveDuration, ease: moveEase },
    });

    if (animationId !== animationIdRef.current) return;

    await pillControls.start({
      x: nextRect.x,
      top: nextRect.top,
      width: nextRect.width,
      height: nextRect.height,
      opacity: 1,
      scaleX: 1,
      borderRadius: '999px',
      transition: { duration: 0.24, ease: 'easeOut' },
    });

    if (animationId !== animationIdRef.current) return;
    currentPillRectRef.current = nextRect;
  };

  const fadeOutPill = async () => {
    const currentRect = currentPillRectRef.current;
    if (!currentRect) return;

    const animationId = ++animationIdRef.current;
    const circleSize = currentRect.height;

    pillControls.stop();

    await pillControls.start({
      x: currentRect.x + (currentRect.width - circleSize) / 2,
      top: currentRect.top,
      width: circleSize,
      height: circleSize,
      opacity: 0,
      scaleX: 0.98,
      borderRadius: '50%',
      transition: { duration: 0.22, ease: pillEase },
    });

    if (animationId !== animationIdRef.current) return;
    currentPillRectRef.current = null;
    pillControls.set({ opacity: 0, scaleX: 1 });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const updateIsMobile = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const measureNavSurface = () => {
      if (navSurfaceRef.current) {
        setNavSurfaceWidth(navSurfaceRef.current.getBoundingClientRect().width);
      }
    };

    measureNavSurface();
    window.addEventListener('resize', measureNavSurface);

    return () => window.removeEventListener('resize', measureNavSurface);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const handleNavHover = (e: React.MouseEvent, index: number) => {
    // Mobile fallback check: disable liquid glass movement on touch devices
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    setHoveredIndex(index);

    const target = e.currentTarget as HTMLElement;
    const nextRect = getPillRect(target);
    if (nextRect) {
      void animatePillTo(nextRect);
    }
  };

  const handleNavLeave = () => {
    fadeTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      void fadeOutPill();
    }, 100);
  };

  useEffect(() => {
    const handleResize = () => {
      if (hoveredIndex === null) return;
      const target = navItemRefs.current[hoveredIndex];
      if (!target) return;

      const nextRect = getPillRect(target);
      if (!nextRect) return;

      currentPillRectRef.current = nextRect;
      pillControls.set({
        x: nextRect.x,
        top: nextRect.top,
        width: nextRect.width,
        height: nextRect.height,
        opacity: 1,
        scaleX: 1,
        borderRadius: '999px',
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredIndex, pillControls]);

  const logoProgress = clamp(scrollY / 260, 0, 1);
  const easedLogoProgress = 1 - Math.pow(1 - logoProgress, 3);
  const mobileCenterFadeProgress = isMobile ? clamp(scrollY / 84, 0, 1) : 0;
  const mobileLeftRevealProgress = isMobile ? clamp((scrollY - 96) / 60, 0, 1) : 0;
  const finalLogoCenter = navSurfaceWidth > 0
    ? clamp(navSurfaceWidth * 0.075, 66, 92)
    : 78;
  const finalTextShift = navSurfaceWidth > 0
    ? clamp(navSurfaceWidth * 0.09, 40, 96)
    : 72;
  const desktopLogoScale = lerp(1.46, 0.58, easedLogoProgress);
  const desktopLogoTranslateX = navSurfaceWidth > 0
    ? lerp(0, finalLogoCenter - navSurfaceWidth / 2, easedLogoProgress)
    : lerp(0, -520, easedLogoProgress);
  const desktopLogoTranslateY = Math.sin(logoProgress * Math.PI) * 16;
  const desktopBrandTextShift = lerp(0, finalTextShift, Math.pow(easedLogoProgress, 1.12));
  const mobileCenterLogoScale = lerp(1, 0.85, mobileCenterFadeProgress);
  const mobileCenterLogoOpacity = 1 - mobileCenterFadeProgress;
  const mobileLeftLogoScale = lerp(0.98, 1.18, mobileLeftRevealProgress);
  const mobileLeftLogoOpacity = mobileLeftRevealProgress;
  const mobileLeftLogoWidth = lerp(0, 28, mobileLeftRevealProgress);
  const mobileLeftLogoGap = lerp(0, 12, mobileLeftRevealProgress);
  const mobileBrandTextShift = lerp(0, 8, mobileLeftRevealProgress);
  const brandTextShift = isMobile ? mobileBrandTextShift : desktopBrandTextShift;
  const centerLogoTransform = isMobile
    ? `translate3d(0, 0, 0) translate(-50%, -50%) scale(${mobileCenterLogoScale})`
    : `translate3d(${desktopLogoTranslateX}px, ${desktopLogoTranslateY}px, 0) translate(-50%, -50%) scale(${desktopLogoScale})`;
  const centerLogoOpacity = isMobile ? mobileCenterLogoOpacity : 1;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 24px' : '20px 24px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        ref={navSurfaceRef}
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 28px',
          position: 'relative',
          borderRadius: '9999px',
          background: scrolled
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.03)',
          backdropFilter: scrolled ? 'blur(40px) saturate(180%)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(180%)' : 'blur(12px)',
          border: scrolled
            ? '1px solid rgba(255, 255, 255, 0.15)'
            : '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : 'none',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Logo / Brand */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.125rem',
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 210,
          }}
        >
          {isMobile && (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${mobileLeftLogoWidth}px`,
                minWidth: `${mobileLeftLogoWidth}px`,
                marginRight: `${mobileLeftLogoGap}px`,
                opacity: mobileLeftLogoOpacity,
                transform: `scale(${mobileLeftLogoScale})`,
                transformOrigin: 'center center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Image
                src="/hero_images/marqueone_logo.png"
                alt=""
                width={28}
                height={28}
                style={{
                  width: '28px',
                  height: 'auto',
                  display: 'block',
                  verticalAlign: 'middle',
                  filter: 'drop-shadow(0 0 16px rgba(0,0,0,0.55))',
                }}
              />
            </span>
          )}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
              transform: `translate3d(${brandTextShift}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            Marque <span style={{ color: '#8B0000', fontSize: 'inherit', fontWeight: 'inherit' }}>One</span>
          </span>
        </a>

        {/* Center Logo Icon */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            left: '50%',
            top: '50%',
            transform: centerLogoTransform,
            transformOrigin: 'center center',
            zIndex: 180,
            pointerEvents: 'none',
            willChange: 'transform',
            opacity: centerLogoOpacity,
          }}
        >
          <Image
            src="/hero_images/marqueone_logo.png"
            alt="Logo"
            width={80}
            height={80}
            style={{
              width: '80px',
              height: 'auto',
              display: 'block',
              verticalAlign: 'middle',
              filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))',
            }}
            priority
          />
        </div>

        {/* Desktop Links */}
        <div
          ref={navContainerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            position: 'relative',
            zIndex: 210,
          }}
          className="nav-desktop"
          onMouseEnter={() => {
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
          }}
          onMouseLeave={handleNavLeave}
        >
          {/* Shared Liquid Glass Element */}
          <motion.div
            animate={pillControls}
            initial={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              originX: 0.5,
              pointerEvents: 'none',
              zIndex: 1,
              borderRadius: '9999px',
              overflow: 'hidden',
              display: 'block',
            }}
          >
            <GlassCard 
              cornerRadius={9999} 
              blurAmount={12} 
              displacementScale={4} 
              padding="0"
              style={{
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0,
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 8px 24px rgba(0, 0, 0, 0.18)',
              }}
            >
              {/* Subtle inner highlight to enhance pill depth */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  background: 'rgba(255, 0, 0, 0)',
                  backdropFilter: 'blur(14px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(180%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%)',
                }}
              />
            </GlassCard>
          </motion.div>

          {navLinks.slice(1).map((link, index) => (
            <a
              key={link.href}
              ref={(element) => {
                navItemRefs.current[index] = element;
              }}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              onMouseEnter={(e) => handleNavHover(e, index)}
              className="nav-link nav-item" // nav-item class for CustomCursor detection
              style={{
                fontSize: '0.75rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '8px 16px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hoveredIndex === index ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)',
                transition: 'color 0.3s ease',
              }}
            >
              {/* Magnetic Text Sync */}
              <span 
                style={{ 
                  position: 'relative', 
                  zIndex: 2,
                  display: 'inline-block',
                  transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                  filter: hoveredIndex === index ? 'brightness(1.15)' : 'brightness(1)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease'
                }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'white',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            maxWidth: '1280px',
            margin: '8px auto 0',
            padding: '24px 28px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '20px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontSize: '0.875rem',
                fontWeight: 400,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
