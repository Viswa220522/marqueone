'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import styles from './garage3d.module.css';

const links = [
  { label: 'Experience', href: '#experience' },
  { label: 'Lineup', href: '#lineup' },
  { label: 'Main Site', href: '/' },
];

export default function Navbar() {
  return (
    <motion.nav
      animate={{ opacity: 1, y: 0 }}
      className={styles.navbar}
      initial={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.navInner}>
        <div className={styles.brandBlock}>
          <span className={styles.brandOverline}>3D Garage Experience</span>
          <Link className={styles.brandMark} href="/garage">
            MARQUE<span>ONE</span>
          </Link>
        </div>

        <div className={styles.navLinks}>
          {links.map((link) =>
            link.href.startsWith('#') ? (
              <a key={link.href} className={styles.navLink} href={link.href}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} className={styles.navLink} href={link.href}>
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className={styles.navActions}>
          <Link className={styles.navBackLink} href="/">
            Back To Site
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
