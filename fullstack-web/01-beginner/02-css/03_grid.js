// ============================================
// CSS GRID LAYOUT
// ============================================
// Grid is a two-dimensional layout system for rows AND columns simultaneously.

// ---- 1. BASIC GRID ----

const basicGrid = `
.container {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 200px 200px;     /* 3 equal fixed columns */
  grid-template-columns: 1fr 1fr 1fr;            /* 3 equal flexible columns */
  grid-template-columns: 1fr 2fr 1fr;            /* Middle column is 2x wider */
  grid-template-columns: repeat(3, 1fr);          /* Shorthand for 3 equal */
  grid-template-columns: repeat(4, minmax(200px, 1fr)); /* Min 200px, grow */

  /* Define rows */
  grid-template-rows: 100px auto 100px;           /* Header, content, footer */
  grid-template-rows: repeat(3, 150px);

  /* Gap between cells */
  gap: 16px;
  row-gap: 20px;
  column-gap: 16px;
}
`;

// ---- 2. FR UNIT AND SIZING FUNCTIONS ----

const sizing = `
.container {
  display: grid;

  /* fr = fraction of available space */
  grid-template-columns: 1fr 3fr;    /* Sidebar 25%, main 75% */

  /* minmax() — responsive without media queries */
  grid-template-columns: minmax(200px, 300px) 1fr;

  /* auto-fit: creates as many columns as fit, empty tracks collapse */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  /* auto-fill: same but keeps empty tracks */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

  /* Best responsive grid pattern — no media queries needed! */
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
}
`;

// ---- 3. GRID TEMPLATE AREAS ----

const gridAreas = `
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header  header"
    "sidebar main   aside"
    "footer  footer  footer";
  min-height: 100vh;
  gap: 16px;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }

/* Use . for empty cells */
/* grid-template-areas: "header header ."
                        "sidebar main  ."
                        "footer footer footer"; */
`;

// ---- 4. PLACING ITEMS ----

const placingItems = `
.item {
  /* By line numbers (lines start at 1) */
  grid-column: 1 / 3;      /* Span from line 1 to line 3 (2 columns) */
  grid-row: 1 / 2;         /* Span 1 row */

  /* Shorthand with span */
  grid-column: span 2;     /* Span 2 columns from current position */
  grid-row: span 3;        /* Span 3 rows */

  /* Start and end separately */
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;

  /* Negative line numbers (count from end) */
  grid-column: 1 / -1;     /* Full width — first to last line */
}

/* Place item in specific area */
.featured {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}
`;

// ---- 5. ALIGNMENT ----

const alignment = `
.container {
  display: grid;
  grid-template-columns: repeat(3, 200px);

  /* Align all items within their cells */
  justify-items: center;    /* Horizontal alignment in cell */
  align-items: center;      /* Vertical alignment in cell */
  place-items: center;      /* Shorthand for both */

  /* Align the entire grid within the container */
  justify-content: center;  /* Horizontal alignment of grid */
  align-content: center;    /* Vertical alignment of grid */
  place-content: center;    /* Shorthand for both */
}

.item {
  /* Override alignment for a single item */
  justify-self: end;
  align-self: start;
  place-self: center end;   /* align-self justify-self */
}
`;

// ---- 6. IMPLICIT GRID ----

const implicitGrid = `
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Only 1 row defined explicitly */
  grid-template-rows: 200px;

  /* Auto-generated rows get this size */
  grid-auto-rows: 150px;
  grid-auto-rows: minmax(100px, auto);  /* At least 100px, grow with content */

  /* Direction for auto-placed items */
  grid-auto-flow: row;     /* Default: fill rows first */
  grid-auto-flow: column;  /* Fill columns first */
  grid-auto-flow: dense;   /* Fill gaps (may reorder items) */
}
`;

// ---- 7. COMMON LAYOUTS ----

// Responsive gallery
const gallery = `
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}
.gallery img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}
`;

// Dashboard layout
const dashboard = `
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar content";
  height: 100vh;
}
.dashboard .content {
  grid-area: content;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
}
`;

// ---- 8. GRID VS FLEXBOX ----
// Grid:  2D layout (rows AND columns) — page layouts, dashboards, galleries
// Flex:  1D layout (row OR column) — navbars, card rows, centering
// Use both together! Grid for page structure, Flexbox inside components.

console.log("CSS Grid Layout — study the template strings above!");
console.log("Key: grid-template-columns + grid-template-areas for layouts");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a 3-column responsive grid that goes to 2 columns on tablet and 1 on mobile
//    using repeat(auto-fit, minmax(...))
// 2. Build a page layout using grid-template-areas with header, sidebar, main, and footer
// 3. Create a gallery where the first image spans 2 columns and 2 rows
// 4. Build a dashboard with a fixed sidebar and a scrollable content area with cards
// 5. When would you use Flexbox vs Grid? Give 3 examples of each
