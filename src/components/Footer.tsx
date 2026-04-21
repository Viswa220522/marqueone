'use client';

import { motion } from 'framer-motion';

const footerLinks = [
  { name: 'Garage', href: '#garage' },
  { name: 'Motor Club', href: '#motorclub' },
  { name: 'Lifestyle', href: '#lifestyle' },
  { name: 'Contact', href: '#contact' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms', href: '#' },
];

const socialIcons = [
  {
    name: 'Twitter', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
    )
  },
  {
    name: 'Instagram', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
    )
  },
  {
    name: 'LinkedIn', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
    )
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-black pb-10 pt-20">
      <div className="footer-container mb-[60px]">
        <div
          aria-hidden="true"
          className="footer-inner"
        >
          <div className="mx-auto h-px w-[55%] border-t border-dotted border-white/20 opacity-20" />
        </div>
      </div>

      <div className="footer-container">
        <div className="footer-inner relative z-10">
          <div className="grid grid-cols-1 gap-[60px] md:grid-cols-2 xl:grid-cols-4">
            <div className="text-center md:text-left">
              <h3 className="mb-5 text-sm font-light uppercase tracking-[0.2em] text-white">
                MARQUE <span className="text-[#ff0000]">ONE</span>
              </h3>
              <p className="mx-auto max-w-[280px] text-[13px] font-normal leading-relaxed text-white/60 md:mx-0">
                Where automotive engineering meets artistic perfection. Curated for those who live beyond the limit.
              </p>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">NAVIGATION</h4>
              <div className="flex flex-col gap-[14px]">
                {footerLinks.slice(0, 4).map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[14px] text-white/80 transition-colors duration-300 hover:text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">LEGAL</h4>
              <div className="flex flex-col gap-[14px]">
                {footerLinks.slice(4).map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[14px] text-white/80 transition-colors duration-300 hover:text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">FOLLOW US</h4>
              <div className="flex justify-center gap-4 md:justify-start">
                {socialIcons.map((social) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    whileHover={{
                      scale: 1.08,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    }}
                    className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.04] text-white/60 transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-center gap-2 md:justify-start">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="text-white/60"
                  aria-hidden="true"
                >
                  <path d="M12 21s-6-5.2-6-11a6 6 0 1 1 12 0c0 5.8-6 11-6 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="text-[12px] uppercase tracking-[0.15em] text-white/60">
                  BANGALORE
                </span>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-3 text-center md:mt-24 md:flex-row md:items-center md:justify-between md:gap-4 md:text-left">
            <div className="hidden md:block md:flex-1" />
            <div className="md:flex md:flex-1 md:justify-center">
              <p className="text-[10px] uppercase tracking-[0.1em] text-white/40 text-center">
                © 2026 MARQUE ONE. ALL RIGHTS RESERVED.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40 md:flex-1 md:justify-end md:text-right md:gap-6">
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none mt-8 overflow-hidden text-center select-none"
          >
            <div
              className="whitespace-nowrap font-['Cinzel','Playfair_Display',serif] font-bold tracking-[0.08em]"
              style={{
                fontSize: 'clamp(64px, 11vw, 140px)',
                lineHeight: 0.85,
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 100%)',
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 100%)',
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.05)' }}>MARQUE </span>
              <span style={{ color: 'rgba(255, 0, 0, 0.1)' }}>ONE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
