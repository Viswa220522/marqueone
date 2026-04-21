# Marque One Cinematic Experience - AI Context

## Project Overview
Marque One is a premium automotive lifestyle brand. The website is designed to provide a high-end, cinematic experience that feels like a luxury film.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4 (with custom inline styles for precision glassmorphism)
- **Animations**: Framer Motion
- **Rendering**: HTML5 Canvas (for Hero animations)

## Design Philosophy
- **Cinematic Luxury**: High contrast, deep blacks, subtle gradients, and glassmorphism.
- **Micro-Animations**: Smooth transitions (200-800ms), parallax effects, and scroll-driven transformations.
- **Branding**: The word "ONE" in "MARQUE ONE" is always highlighted in deep red (`#8B0000` or `#ff0000` depending on context).
- **Typography**: Clean, spaced-out uppercase labels (tracking `0.2em`+), modern serif/sans-serif mix.

## Key Components
- `Hero.tsx`: High-performance canvas-based scroll animation.
- `Navbar.tsx`: Floating glass pill that transforms based on scroll.
- `Footer.tsx`: Minimalist 4-column layout with a large, masked background watermark.
- `SmoothScroll.tsx`: Lenis-based smooth scrolling integration.

## Environment Setup
1. **Node.js**: 18+ recommended.
2. **Install**: `npm install`
3. **Dev**: `npm run dev`
4. **Dependencies**: `framer-motion`, `lucide-react`, `lenis`.

## Current Status & Guidelines
- **Navigation**: The silver logo icon is integrated into the Navbar to ensure correct z-index layering.
- **Spacing**: Vertical gaps between sections are tightened for a more compact, premium feel.
- **Watermark**: The footer watermark uses `mask-image` for a top-to-bottom fade into the background.

## Future Roadmap (AI Tasks)
- **3D Logo**: Integration of a GLB model using `Three.js` / `React Three Fiber` in the Navbar.
- **Performance**: Audit canvas rendering on mobile devices.
- **Content**: Expand Motor Club and Lifestyle sections with more cinematic imagery.
