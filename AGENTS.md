# AGENTS.md - Marque One Development Guide

This file provides guidelines for agentic coding agents working in this repository.

---

## 1. Build, Lint, and Test Commands

### Development
```bash
npm run dev           # Start development server (localhost:3000)
npm run dev -- -p 3005  # Start on custom port
```

### Production Build
```bash
npm run build         # Create production build
npm run start         # Start production server after build
npm run lint          # Run ESLint on entire codebase
```

### Type Checking
```bash
npx tsc --noEmit     # Run TypeScript type checking without emitting files
```

### Code Formatting
```bash
npx prettier --write src/    # Format all files in src/ (if prettier is installed)
```

### Note on Testing
- **No test framework is currently configured** (no Jest, Vitest, or Playwright)
- To add testing, consider: `npm install -D vitest @testing-library/react @testing-library/dom jsdom`
- Run single test file with Vitest: `npx vitest run src/components/__tests__/ComponentName.test.tsx`

---

## 2. Project Structure

```
marqueone/
├── public/                 # Static assets
│   ├── cars_3D/           # 3D GLB model files for garage experience
│   └── hero_images/       # Hero section image assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Homepage (main entry)
│   │   ├── layout.tsx     # Root layout
│   │   ├── globals.css    # Global styles (Tailwind + custom)
│   │   └── garage/        # 3D Garage experience route
│   └── components/        # React components
│       ├── garage3d/      # 3D garage components (R3F, Three.js)
│       └── *.tsx          # UI components
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
```

---

## 3. Code Style Guidelines

### TypeScript
- **Strict mode enabled** - all TS strict flags are on
- Use explicit types for function parameters and return types when not inferrable
- Prefer `type` over `interface` for unions, primitives, and object literals; use `interface` for extensible objects
- Never use `any` - use `unknown` if type is truly uncertain, then narrow with type guards

### React & Next.js
- Use `'use client'` directive for client-side components (hooks, event handlers, browser APIs)
- Server components by default - only add `'use client'` when needed
- Use `next/link` for internal navigation, `<a>` for external links
- Use `next/image` for images with proper sizing and optimization
- Prefer composition over abstraction - don't over-engineer component APIs
- Use functional components with hooks, not class components

### Imports
- Use path alias `@/*` for internal imports: `import Component from '@/components/Component'`
- Order imports consistently:
  1. External libraries (react, next, framer-motion, three)
  2. Internal packages (@/components, @/hooks)
  3. Relative imports (./utils, ../lib)
  4. Type imports (import type { ... })
- Group imports with empty lines between groups

### Naming Conventions
- **Files**: PascalCase for components (`Navbar.tsx`, `GarageScene.tsx`), camelCase for utilities (`useSmoothScroll.ts`)
- **Components**: PascalCase (`export default function Navbar() {...}`)
- **Hooks**: camelCase starting with `use` (`useSmoothScroll`, `useActiveModel`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for configuration objects
- **CSS Modules**: camelCase (`.garage3d.module.css` → `styles.sceneCanvas`)

### CSS & Styling
- This project uses **Tailwind CSS v4** via `@import "tailwindcss"` in globals.css
- Use Tailwind utility classes for common styling
- Use CSS Modules (`.module.css`) for component-specific styles that won't conflict
- Use inline styles sparingly - only for dynamic values or one-off overrides
- Follow existing pattern: inline styles for component-specific layout, Tailwind for typography/spacing

### Error Handling
- Always wrap async operations in try/catch for user-facing errors
- Console.error with descriptive messages for development debugging
- Never expose sensitive information in error messages
- Use Error Boundaries for React component tree failure isolation
- Validate external data (API responses, user input) at boundaries

### 3D Development (React Three Fiber)
- Always dispose of Three.js resources (geometries, materials, textures) in cleanup effects
- Use `frameloop="demand"` for static scenes to improve performance
- Lazy load 3D components with `React.lazy()` and Suspense
- Load models sequentially (not all at once) to maintain responsive UX
- Disable shadows and reduce DPR on mobile devices

---

## 4. Key Dependencies

| Package | Purpose |
|---------|---------|
| next 16.2.4 | React framework (App Router) |
| react 19.2.4 | UI library |
| framer-motion | Animations |
| @react-three/fiber | React renderer for Three.js |
| @react-three/drei | R3F helpers (OrbitControls, etc.) |
| three | 3D graphics library |
| @studio-freight/lenis | Smooth scrolling |
| tailwindcss v4 | Utility-first CSS |
| lucide-react | Icon library |

---

## 5. Common Patterns

### Client Component Pattern
```tsx
'use client';

import { useState, useEffect } from 'react';

export default function ClientComponent() {
  const [state, setState] = useState('');
  
  useEffect(() => {
    // Browser-only logic
  }, []);
  
  return <div>{state}</div>;
}
```

### Dynamic 3D Model Loading
```tsx
const GarageScene = lazy(() => import('./GarageScene'));

// In render:
<Suspense fallback={<LoadingShell />}>
  <GarageScene {...props} />
</Suspense>
```

### Progressive Loading (3D Models)
```tsx
// Load models one at a time, not all at once
for (const model of models) {
  onLoadingChange(model.id);
  const gltf = await loader.loadAsync(model.assetPath);
  onModelLoaded(model.id);
  await nextFrame(); // Allow UI to update between loads
}
```

---

## 6. What to Avoid

- **Do not** use `display: none` for responsive hiding - use Tailwind's `md:hidden`, `lg:block`, etc.
- **Do not** import Vite-specific packages (like `motion/react` from Vite's motion library - use `framer-motion` instead)
- **Do not** put heavy 3D assets on the homepage - lazy load the `/garage` route
- **Do not** use `eslint-disable` unless absolutely necessary - fix the underlying issue
- **Do not** commit secrets or API keys - use `.env.local` and never commit it

---

## 7. Working with the Garage 3D Route

The `/garage` route (`src/app/garage/page.tsx`) hosts the integrated 3D experience:

- Models live in `public/cars_3D/` as GLB files
- Garage components in `src/components/garage3d/` use R3F (React Three Fiber)
- Models load sequentially via `GarageScene.tsx` - first model loads, renders, then next
- Use `prefetch={false}` on Next.js Link to prevent preloading heavy 3D route on homepage

---

## 8. Brand & Design Context

### Project Overview
Marque One is a premium automotive lifestyle brand. The website provides a high-end, cinematic experience that feels like a luxury film.

### Design Philosophy
- **Cinematic Luxury**: High contrast, deep blacks, subtle gradients, and glassmorphism.
- **Micro-Animations**: Smooth transitions (200-800ms), parallax effects, and scroll-driven transformations.
- **Branding**: The word "ONE" in "MARQUE ONE" is always highlighted in deep red (`#8B0000` or `#ff0000` depending on context).
- **Typography**: Clean, spaced-out uppercase labels (tracking `0.2em`+), modern serif/sans-serif mix.

### Key Components
- `Hero.tsx` (src/components/Hero.tsx): High-performance canvas-based scroll animation.
- `Navbar.tsx` (src/components/Navbar.tsx): Floating glass pill that transforms based on scroll.
- `Footer.tsx` (src/components/Footer.tsx): Minimalist 4-column layout with a large, masked background watermark.
- `SmoothScroll.tsx` (src/components/SmoothScroll.tsx): Lenis-based smooth scrolling integration.

### Current Implementation Details
- The silver logo icon is integrated into the Navbar for correct z-index layering.
- Vertical gaps between sections are tightened for a compact, premium feel.
- The footer watermark uses `mask-image` for a top-to-bottom fade into the background.
- The 3D experience route (/garage) is fully integrated with React Three Fiber loading GLB models from public/cars_3D/.

### Future Roadmap (Potential AI Tasks)
- Audit canvas rendering on mobile devices.
- Expand Motor Club and Lifestyle sections with more cinematic imagery.
- Continue 3D integration refinements if needed.

---

Generated for agentic coding assistance. Update as project evolves.