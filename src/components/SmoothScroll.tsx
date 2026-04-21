'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    // Lenis is disabled — it conflicts with CSS position: sticky on the hero canvas.
    // Native smooth scrolling is used instead via CSS scroll-behavior.
  }, []);

  return null;
}
