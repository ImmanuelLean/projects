// ============================================
// CSS FLEXBOX LAYOUT
// ============================================
// Flexbox is a one-dimensional layout system for arranging items in rows or columns.

// ---- 1. ENABLING FLEXBOX ----

const basicFlex = `
.container {
  display: flex;           /* Creates a flex container */
  /* All direct children become flex items */
}

/* Inline flex — container behaves like inline element */
.inline-container {
  display: inline-flex;
}
`;

// ---- 2. CONTAINER PROPERTIES ----

const containerProps = `
.container {
  display: flex;

  /* DIRECTION — main axis */
  flex-direction: row;              /* Default: left to right */
  flex-direction: row-reverse;      /* Right to left */
  flex-direction: column;           /* Top to bottom */
  flex-direction: column-reverse;   /* Bottom to top */

  /* WRAPPING */
  flex-wrap: nowrap;     /* Default: all items on one line */
  flex-wrap: wrap;       /* Items wrap to next line */
  flex-wrap: wrap-reverse;

  /* Shorthand */
  flex-flow: row wrap;

  /* JUSTIFY-CONTENT — alignment along MAIN axis */
  justify-content: flex-start;      /* Default: packed to start */
  justify-content: flex-end;        /* Packed to end */
  justify-content: center;          /* Centered */
  justify-content: space-between;   /* Even space between items */
  justify-content: space-around;    /* Even space around items */
  justify-content: space-evenly;    /* Equal space everywhere */

  /* ALIGN-ITEMS — alignment along CROSS axis */
  align-items: stretch;    /* Default: items stretch to fill */
  align-items: flex-start; /* Aligned to top */
  align-items: flex-end;   /* Aligned to bottom */
  align-items: center;     /* Centered vertically */
  align-items: baseline;   /* Aligned by text baseline */

  /* ALIGN-CONTENT — multi-line cross axis alignment (needs flex-wrap) */
  align-content: flex-start;
  align-content: center;
  align-content: space-between;

  /* GAP — space between items */
  gap: 16px;               /* Row and column gap */
  row-gap: 16px;
  column-gap: 24px;
}
`;

// ---- 3. ITEM PROPERTIES ----

const itemProps = `
.item {
  /* FLEX-GROW — how much item should grow (0 = don't grow) */
  flex-grow: 0;     /* Default */
  flex-grow: 1;     /* Takes equal share of available space */

  /* FLEX-SHRINK — how much item should shrink (1 = can shrink) */
  flex-shrink: 1;   /* Default */
  flex-shrink: 0;   /* Don't shrink */

  /* FLEX-BASIS — initial size before growing/shrinking */
  flex-basis: auto;   /* Default: use width/height */
  flex-basis: 200px;  /* Start at 200px */
  flex-basis: 0;      /* Ignore content size, distribute evenly */

  /* FLEX SHORTHAND (grow, shrink, basis) */
  flex: 0 1 auto;   /* Default */
  flex: 1;           /* Same as: 1 1 0 — grow equally */
  flex: none;        /* Same as: 0 0 auto — fixed size */

  /* ALIGN-SELF — override align-items for one item */
  align-self: center;
  align-self: flex-end;

  /* ORDER — visual order (default: 0) */
  order: -1;   /* Appears first */
  order: 1;    /* Appears later */
}
`;

// ---- 4. COMMON LAYOUT PATTERNS ----

// Perfect centering
const centerLayout = `
.center-everything {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
`;

// Navigation bar
const navbar = `
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: #1a1a2e;
  color: white;
}
.navbar .logo { flex-shrink: 0; }
.navbar .nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
}
`;

// Card row
const cardRow = `
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 300px;   /* Grow, shrink, min 300px — responsive cards */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
`;

// Holy grail layout
const holyGrail = `
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.page header, .page footer {
  flex-shrink: 0;
  padding: 16px;
  background: #333;
  color: white;
}
.page .content {
  display: flex;
  flex: 1;
}
.page .sidebar { flex: 0 0 250px; background: #f0f0f0; }
.page .main { flex: 1; padding: 20px; }
`;

// Sticky footer
const stickyFooter = `
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.page main { flex: 1; }
/* Footer automatically pushed to bottom */
`;

console.log("Flexbox Layout — study the template strings above!");
console.log("Key: justify-content = main axis, align-items = cross axis");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a flex container that centers a single child both horizontally and vertically
// 2. Build a navbar with a logo on the left and 4 nav links on the right
// 3. Create a responsive card grid where cards are min 250px and grow to fill space
// 4. Make a layout with 3 items where the middle item takes 2x the space of the others
// 5. Create a footer that sticks to the bottom even when content is short
// 6. Reverse the visual order of 5 items without changing HTML
