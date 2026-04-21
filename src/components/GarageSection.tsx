'use client';

import { motion } from 'framer-motion';
import { Settings, Shield, Zap } from 'lucide-react';

const services = [
  {
    title: 'Luxury Servicing',
    description: 'Expert maintenance for the world\'s most prestigious marques.',
    icon: Settings
  },
  {
    title: 'Precision Detailing',
    description: 'Restoring and protecting every surface to concours standards.',
    icon: Shield
  },
  {
    title: 'Performance Upgrades',
    description: 'Bespoke engineering to unlock your vehicle\'s true potential.',
    icon: Zap
  }
];

export default function GarageSection() {
  return (
    <section 
      id="garage" 
      className="relative px-6" 
      style={{ 
        marginTop: '-100vh', 
        paddingTop: '20vh', 
        paddingBottom: '4rem',
        zIndex: 20,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 30vh, #000 60vh, #000 100%)',
        pointerEvents: 'none', 
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', pointerEvents: 'auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          style={{ marginBottom: '80px', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Marque One Garage
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '640px', margin: '0 auto', fontSize: '1.125rem' }}>
            Where automotive engineering meets artistic perfection.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
              className="glass-card"
              style={{
                padding: '48px',
                borderRadius: '24px',
                cursor: 'default',
                transition: 'all 0.3s ease',
              }}
            >
              <service.icon 
                style={{ width: '48px', height: '48px', marginBottom: '32px', color: 'rgba(255,255,255,0.4)' }} 
              />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '16px' }}>
                {service.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
