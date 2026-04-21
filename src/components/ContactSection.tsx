'use client';

import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section id="contact" style={{ 
      position: 'relative', 
      padding: '160px 24px', 
      background: '#000', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      minHeight: '80vh'
    }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ 
          width: '500px', height: '500px', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '50%', 
          filter: 'blur(100px)' 
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ position: 'relative', zIndex: 10, maxWidth: '640px' }}
      >
        <h2 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3.75rem)', 
          fontWeight: 300, 
          letterSpacing: '-0.02em', 
          marginBottom: '48px',
          lineHeight: 1.2
        }}>
          Experience the <br /> 
          <span style={{ fontWeight: 400, fontStyle: 'italic' }}>Marque One Lifestyle</span>
        </h2>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.98 }}
          className="glass-card"
          style={{
            padding: '20px 48px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 300,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Begin Your Journey
        </motion.button>

        <div style={{ marginTop: '96px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          <p style={{ marginBottom: '16px' }}>Geneva &bull; London &bull; Dubai</p>
          <p style={{ fontSize: '0.625rem' }}>&copy; 2026 Marque One. All Rights Reserved.</p>
        </div>
      </motion.div>
    </section>
  );
}
