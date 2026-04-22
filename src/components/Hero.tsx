'use client';

import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 222;
const CURRENT_FRAME = (index: number) =>
  `/hero_images/A_matte_gold_202604211506_000/A_matte_gold_202604211506_${index.toString().padStart(3, '0')}.webp`;

const blurKeyframes = [
  { frame: 0, blur: 0 },
  { frame: 30, blur: 0 },
  { frame: 80, blur: 2 },
  { frame: 140, blur: 0 },
  { frame: 180, blur: 6 },
  { frame: 220, blur: 10 },
  { frame: 221, blur: 3 },
];

const cinematicTexts = [
  { start: 0, end: 40, text: 'Not just a machine' },
  { start: 40, end: 90, text: 'A presence' },
  { start: 90, end: 140, text: 'Engineered for those who demand more' },
  { start: 140, end: 180, text: "You don't watch it. You become part of it" },
  { start: 180, end: 222, text: 'Welcome to Marque ', highlight: 'One' },
];

function getInterpolatedBlur(frame: number): number {
  for (let i = 0; i < blurKeyframes.length - 1; i++) {
    const s = blurKeyframes[i];
    const e = blurKeyframes[i + 1];
    if (frame >= s.frame && frame <= e.frame) {
      if (e.frame === s.frame) return s.blur;
      const t = (frame - s.frame) / (e.frame - s.frame);
      return s.blur + (e.blur - s.blur) * t;
    }
  }
  return 0;
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // ── Image loading ──────────────────────────────────────────────
  useEffect(() => {
    const list: HTMLImageElement[] = [];
    let loaded = 0;

    const onFirstBatchDone = () => {
      imagesRef.current = list;
      drawFrame(0);
      // lazy-load the rest
      for (let i = 25; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = CURRENT_FRAME(i);
        img.onload = () => { list[i] = img; };
      }
    };

    for (let i = 0; i < 25; i++) {
      const img = new Image();
      img.src = CURRENT_FRAME(i);
      img.onload = () => {
        list[i] = img;
        loaded++;
        if (loaded === 25) onFirstBatchDone();
      };
    }
  }, []);

  const overlapProgressRef = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // ── Scroll listener → frame index ─────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const canvasContainer = canvasContainerRef.current;
      if (!section || !canvasContainer) return;

      const scrollTop = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionH = section.clientHeight;
      const viewportH = window.innerHeight;

      // We want the animation to finish before the last 100vh of scrollable area,
      // because the next section will have a -100vh top margin to overlap.
      const animationScrollable = sectionH - 2 * viewportH;

      // progress 0→1 over the animation scrollable range
      const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop) / animationScrollable));
      const frame = Math.floor(progress * (FRAME_COUNT - 1));

      // overlap progress 0→1 over the last 100vh of scrollable area
      const overlapStart = sectionTop + animationScrollable;
      const overlapProgress = Math.max(0, Math.min(1, (scrollTop - overlapStart) / viewportH));

      // Apply opacity directly to the container to avoid React re-renders
      // Base opacity slightly reduces to 0.9 at the start of overlap, then fades to 0
      const targetOpacity = 1 - (overlapProgress * 1);
      canvasContainer.style.opacity = targetOpacity.toString();

      if (frame !== frameRef.current || overlapProgress !== overlapProgressRef.current) {
        frameRef.current = frame;
        overlapProgressRef.current = overlapProgress;
        setCurrentFrameIndex(frame);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frame, overlapProgress));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // paint initial frame
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);


  // ── Draw a single frame onto the canvas ───────────────────────
  function drawFrame(index: number, overlapProgress: number = 0) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;

    // Size canvas to exact device pixels
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth * dpr;
    const h = window.innerHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // Cover-fit
    const ir = img.width / img.height;
    const cr = w / h;
    let dw: number, dh: number, ox: number, oy: number;
    if (ir > cr) {
      dh = h; dw = h * ir; ox = (w - dw) / 2; oy = 0;
    } else {
      dw = w; dh = w / ir; ox = 0; oy = (h - dh) / 2;
    }

    let blur = getInterpolatedBlur(index);

    // Add extra blur during the overlap transition (Stage 1 & 2)
    if (overlapProgress > 0) {
      blur += overlapProgress * 8; // Increases blur up to 8px extra
    }

    ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, ox, oy, dw, dh);
    ctx.filter = 'none';
  }

  // ── Resize → redraw current frame ─────────────────────────────
  useEffect(() => {
    const handleResize = () => drawFrame(frameRef.current, overlapProgressRef.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '400vh',
        background: '#000',
      }}
    >
      {/* ── Sticky viewport stage ── */}
      <div
        ref={canvasContainerRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          transition: 'opacity 0.1s ease-out', // Smooth out any frame drops
        }}
      >
        {/* Canvas — fills the viewport exactly */}
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />



        {/* Cinematic Text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {cinematicTexts.map((item, i) => {
            const active =
              currentFrameIndex >= item.start && currentFrameIndex < item.end;
            return (
              <h2
                key={i}
                style={{
                  position: 'absolute',
                  textAlign: 'center',
                  fontSize: 'clamp(1rem, 3vw, 2rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 300,
                  padding: '0 24px',
                  color: '#fff',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                  textShadow:
                    '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6)',
                }}
              >
                {item.text}
                {item.highlight && (
                  <span style={{ color: '#8B0000', fontSize: 'inherit', fontWeight: 'inherit' }}>
                    {item.highlight}
                  </span>
                )}
              </h2>
            );
          })}
        </div>
      </div>
    </section>
  );
}
