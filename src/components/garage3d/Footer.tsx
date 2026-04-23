import Link from 'next/link';

import { garageModels } from './data';
import styles from './garage3d.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.brandOverline}>Marque One Garage</span>
          <div className={styles.brandMark}>
            MARQUE<span>ONE</span>
          </div>
          <p className={styles.sectionCopy}>
            A single Next.js experience with progressive 3D loading, shared routing, and no separate Vite runtime.
          </p>
        </div>

        <div className={styles.footerGrid}>
          <div>
            <span className={styles.cardEyebrow}>Navigation</span>
            <div className={styles.footerLinks}>
              <a className={styles.navLink} href="#experience">
                Experience
              </a>
              <a className={styles.navLink} href="#lineup">
                Lineup
              </a>
              <Link className={styles.navLink} href="/">
                Main Site
              </Link>
            </div>
          </div>

          <div>
            <span className={styles.cardEyebrow}>Assets</span>
            <p className={styles.footerNote}>{garageModels.length} local GLB models streamed sequentially from `public/cars_3D`.</p>
          </div>

          <div>
            <span className={styles.cardEyebrow}>Status</span>
            <p className={styles.footerNote}>Unified React + Next.js stack active.</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {currentYear} Marque One</span>
          <span>Garage route integrated into the main application</span>
        </div>
      </div>
    </footer>
  );
}
