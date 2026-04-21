'use client';

import { motion } from 'framer-motion';

export default function LifestyleSection() {
  return (
    <section id="lifestyle" style={{ position: 'relative', padding: '100px 24px', background: '#000', overflow: 'hidden' }}>
      {/* Ambient Glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '800px', height: '800px', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '50%', 
          filter: 'blur(120px)' 
        }} />
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Background Watermark */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.03 }}
          transition={{ duration: 1.5 }}
          style={{ 
            position: 'absolute', 
            top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', 
            fontSize: 'clamp(4rem, 15vw, 12rem)',
            fontWeight: 300,
            letterSpacing: '-0.05em',
            width: '100%',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          LIFESTYLE
        </motion.div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 4.5rem)', 
              fontWeight: 300, 
              lineHeight: 1.15, 
              maxWidth: '900px', 
              margin: '0 auto 48px' 
            }}
          >
            Curated experiences for those who live beyond the limit.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '48px', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.3em', 
              fontSize: '0.875rem' 
            }}
          >
            <span>Events</span>
            <span>Travel</span>
            <span>Art</span>
            <span>Culture</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
