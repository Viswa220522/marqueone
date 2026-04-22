'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function MotorClubSection() {
  return (
    <section 
      id="motorclub"
      style={{ 
        position: 'relative', 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        overflow: 'hidden', 
        background: '#000',
        padding: '60px 24px'
      }}
    >
      {/* Background Animated Lines */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <motion.path
            d="M-100,300 Q200,200 400,300 T800,280 T1300,300"
            fill="none"
            stroke="white"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d="M-100,340 Q200,260 400,340 T800,320 T1300,340"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M-100,370 Q300,310 500,370 T900,350 T1300,370"
            fill="none"
            stroke="white"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 5, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </div>

      <div className="page-container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto flex max-w-[480px] flex-col items-center text-center sm:mx-0 sm:block sm:max-w-none sm:text-left"
          >
            <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', marginBottom: '24px', display: 'block' }}>
              Elite Access
            </span>
            <h2 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, letterSpacing: '-0.04em', marginBottom: '32px', fontStyle: 'italic' }}>
              Motor Club
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: '480px', marginBottom: '40px' }}>
              Join the most exclusive collective of automotive enthusiasts. From private track days to transcontinental rallies.
            </p>
            <button 
              style={{ 
                padding: '16px 32px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                background: 'transparent',
                color: 'white',
                borderRadius: '9999px', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white'; }}
            >
              Membership
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="glass-card"
            style={{
              aspectRatio: '4/5',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              src="/hero_images/marqueone_track.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: 'contain',
                objectPosition: 'center 42%',
                padding: '28px 28px 152px',
                opacity: 0.95,
              }}
            />
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', 
              display: 'flex', 
              alignItems: 'flex-end', 
              padding: '48px' 
            }}>
              <div>
                <p style={{ fontSize: '1.875rem', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '16px' }}>
                  The Circuit awaits.
                </p>
                <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Members Only</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
