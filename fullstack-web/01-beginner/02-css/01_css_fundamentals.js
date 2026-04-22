// ============================================
// CSS FUNDAMENTALS
// ============================================
// CSS (Cascading Style Sheets) controls the visual presentation of HTML documents.

// ---- 1. THREE WAYS TO INCLUDE CSS ----

const inlineCSS = `<p style="color: red; font-size: 18px;">Styled inline</p>`;

const internalCSS = `
<head>
  <style>
    p { color: blue; font-size: 16px; }
  </style>
</head>`;

const externalCSS = `<link rel="stylesheet" href="styles.css">`;
// External is preferred — separates concerns, cacheable, reusable

// ---- 2. SELECTORS ----

const selectors = `
/* Element selector */
p { color: black; }

/* Class selector (reusable) */
.highlight { background: yellow; }

/* ID selector (unique per page) */
#main-title { font-size: 32px; }

/* Descendant selector (any depth) */
div p { margin: 10px; }

/* Child selector (direct child only) */
ul > li { list-style: square; }

/* Attribute selector */
input[type="email"] { border: 2px solid blue; }

/* Pseudo-classes (states) */
a:hover { color: red; }
input:focus { outline: 2px solid blue; }
li:nth-child(odd) { background: #f0f0f0; }
li:first-child { font-weight: bold; }

/* Pseudo-elements (parts of elements) */
p::first-line { font-weight: bold; }
p::before { content: "→ "; }
p::after { content: " ←"; }

/* Grouping */
h1, h2, h3 { font-family: Arial, sans-serif; }
`;

// ---- 3. SPECIFICITY & CASCADE ----
// Specificity determines which rule wins when multiple rules match.
// Inline styles (1000) > IDs (100) > Classes/pseudo-classes (10) > Elements (1)

const specificity = `
p { color: black; }              /* Specificity: 0,0,1 */
.text { color: blue; }           /* Specificity: 0,1,0 */
#intro { color: green; }         /* Specificity: 1,0,0 */
p.text#intro { color: red; }     /* Specificity: 1,1,1 — wins! */

/* !important overrides everything (avoid when possible) */
p { color: purple !important; }
`;

// ---- 4. BOX MODEL ----
// Every element is a box: content → padding → border → margin

const boxModel = `
.box {
  width: 300px;
  height: 200px;
  padding: 20px;              /* Space inside the border */
  border: 2px solid black;    /* The border itself */
  margin: 10px;               /* Space outside the border */

  /* Without box-sizing, total width = 300 + 40 + 4 = 344px */
  /* With border-box, width stays 300px (padding+border included) */
  box-sizing: border-box;
}

/* Apply border-box globally (best practice) */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Margin shorthand */
.example {
  margin: 10px;                /* all sides */
  margin: 10px 20px;           /* top/bottom  left/right */
  margin: 10px 20px 30px 40px; /* top right bottom left (clockwise) */
  margin: 0 auto;              /* center horizontally */
}
`;

// ---- 5. COLORS ----

const colors = `
.colors {
  color: red;                          /* Named */
  color: #ff0000;                      /* Hex */
  color: #f00;                         /* Hex shorthand */
  color: rgb(255, 0, 0);              /* RGB */
  color: rgba(255, 0, 0, 0.5);        /* RGBA (with opacity) */
  color: hsl(0, 100%, 50%);           /* HSL (hue, saturation, lightness) */
  background-color: #f5f5f5;
  opacity: 0.8;                        /* Whole element opacity */
}
`;

// ---- 6. TYPOGRAPHY ----

const typography = `
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;          /* Base font size */
  font-weight: 400;         /* normal=400, bold=700 */
  line-height: 1.6;         /* 1.6x the font size */
  color: #333;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

a {
  text-decoration: none;     /* Remove underline */
  color: #0066cc;
}

p {
  text-align: justify;       /* left, right, center, justify */
  text-indent: 2em;
}
`;

// ---- 7. CSS UNITS ----

const units = `
.units {
  /* Absolute units */
  width: 300px;             /* Pixels — most common absolute unit */

  /* Relative units */
  font-size: 1.5em;         /* Relative to parent's font-size */
  font-size: 1.5rem;        /* Relative to root (html) font-size */
  width: 50%;               /* Relative to parent's width */
  height: 100vh;            /* 100% of viewport height */
  width: 80vw;              /* 80% of viewport width */
  min-height: 50dvh;        /* Dynamic viewport height (mobile-friendly) */
}

/* Best practice:
   - rem for font sizes (consistent scaling)
   - px for borders, shadows
   - % or vw/vh for layout widths/heights
   - em for padding/margin relative to font size */
`;

// ---- 8. COMMON PROPERTIES ----

const commonProps = `
.card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  overflow: hidden;           /* Hide content that overflows */
  cursor: pointer;
  transition: transform 0.3s ease;  /* Smooth animations */
}

.card:hover {
  transform: translateY(-4px);
}

.hidden { display: none; }
.invisible { visibility: hidden; }   /* Still takes up space */
.centered-text { text-align: center; }
`;

// ---- 9. DISPLAY PROPERTY ----

const display = `
/* Block — full width, new line (div, p, h1-h6) */
span.block { display: block; }

/* Inline — only as wide as content, no width/height (span, a, strong) */
div.inline { display: inline; }

/* Inline-block — inline but allows width/height */
.badge { display: inline-block; padding: 4px 8px; }

/* None — removes from layout entirely */
.hidden { display: none; }
`;

console.log("CSS Fundamentals — study the template strings above!");
console.log("Key topics: selectors, specificity, box model, colors, units");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Write a selector that targets all <a> tags inside a <nav> with class "main-nav"
// 2. Calculate the total width of an element with:
//    width: 200px, padding: 15px, border: 3px, margin: 10px (without border-box)
// 3. Convert this color to rgba with 70% opacity: #3498db
// 4. What's the specificity of: div.container > p.text:first-child ?
// 5. Write CSS to create a centered card with max-width 500px, shadow, and rounded corners
