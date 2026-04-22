// ============================================
// RESPONSIVE WEB DESIGN
// ============================================
// Making websites work across all device sizes.

// ---- 1. VIEWPORT META TAG ----

const viewport = `
<!-- Required in HTML <head> for responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Without this, mobile browsers render at ~980px and zoom out -->
`;

// ---- 2. MOBILE-FIRST APPROACH ----
// Write base styles for mobile, then add complexity for larger screens.

const mobileFirst = `
/* Base styles — mobile (small screens) */
.container {
  padding: 16px;
  font-size: 16px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;     /* Single column on mobile */
  gap: 16px;
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .container { padding: 32px; max-width: 1200px; margin: 0 auto; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large desktop (1440px and up) */
@media (min-width: 1440px) {
  .container { max-width: 1400px; }
  .grid { grid-template-columns: repeat(4, 1fr); }
}
`;

// ---- 3. MEDIA QUERIES ----

const mediaQueries = `
/* Common breakpoints */
/* Mobile:  < 768px  (base styles, no query needed) */
/* Tablet:  768px    */
/* Desktop: 1024px   */
/* Large:   1440px   */

/* Min-width (mobile-first — most common) */
@media (min-width: 768px) { /* tablet and up */ }

/* Max-width (desktop-first) */
@media (max-width: 767px) { /* mobile only */ }

/* Range (between two sizes) */
@media (min-width: 768px) and (max-width: 1023px) { /* tablet only */ }

/* Orientation */
@media (orientation: landscape) { /* landscape mode */ }

/* Hover capability (touch vs mouse) */
@media (hover: hover) {
  .button:hover { background: #0056b3; }
}

/* Prefers reduced motion (accessibility) */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body { background: #1a1a1a; color: #eee; }
}
`;

// ---- 4. RESPONSIVE TYPOGRAPHY ----

const responsiveType = `
/* Using clamp() — min, preferred, max */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* At least 1.5rem, scales with viewport, max 3rem */
}

p {
  font-size: clamp(1rem, 1.2vw, 1.25rem);
  line-height: 1.6;
}

/* Fluid type scale */
:root {
  --text-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.35vw, 1.125rem);
  --text-lg: clamp(1.25rem, 1rem + 0.75vw, 1.5rem);
  --text-xl: clamp(1.5rem, 1.1rem + 1.25vw, 2.25rem);
  --text-2xl: clamp(2rem, 1.5rem + 2vw, 3.5rem);
}
`;

// ---- 5. RESPONSIVE IMAGES ----

const responsiveImages = `
/* Basic responsive image */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

<!-- srcset — serve different sizes based on device -->
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  alt="Responsive image"
/>

<!-- picture element — art direction (different crops) -->
<picture>
  <source media="(min-width: 1024px)" srcset="hero-wide.jpg" />
  <source media="(min-width: 768px)" srcset="hero-medium.jpg" />
  <img src="hero-mobile.jpg" alt="Hero image" />
</picture>
`;

// ---- 6. CSS CUSTOM PROPERTIES (Variables) ----

const cssVariables = `
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-text: #1f2937;
  --color-bg: #ffffff;
  --color-surface: #f3f4f6;

  /* Spacing */
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Border radius */
  --radius: 8px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}

/* Dark mode override */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f3f4f6;
    --color-bg: #111827;
    --color-surface: #1f2937;
  }
}

/* Usage */
.button {
  background: var(--color-primary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius);
  color: white;
  border: none;
  cursor: pointer;
}

.button:hover {
  background: var(--color-primary-dark);
}

.card {
  background: var(--color-surface);
  padding: var(--space-lg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
}
`;

// ---- 7. RESPONSIVE PATTERNS ----

const responsiveNav = `
/* Responsive navigation */
.nav {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.nav-toggle { display: block; }  /* Show hamburger on mobile */
.nav-links { display: none; }    /* Hide links on mobile */
.nav-links.active { display: flex; flex-direction: column; }

@media (min-width: 768px) {
  .nav { flex-direction: row; justify-content: space-between; align-items: center; }
  .nav-toggle { display: none; }  /* Hide hamburger */
  .nav-links { display: flex; gap: 24px; }
}
`;

const containerQuery = `
/* Modern: Container queries (style based on parent, not viewport) */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { display: flex; gap: 16px; }
}

@container (min-width: 600px) {
  .card { font-size: 1.1rem; }
}
`;

console.log("Responsive Design — study the template strings above!");
console.log("Key: mobile-first, clamp(), auto-fit/minmax, CSS variables");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Write a mobile-first responsive grid that shows 1 col on mobile,
//    2 on tablet (768px), 3 on desktop (1024px)
// 2. Create a fluid heading that scales from 24px to 48px using clamp()
// 3. Set up CSS variables for a design system (colors, spacing, shadows)
//    and override them for dark mode
// 4. Build a responsive nav that collapses to a hamburger on mobile
// 5. Use container queries to style a card differently based on its parent width
