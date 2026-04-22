// ============================================================
// 01 — HTML BASICS: The Foundation of Every Web Page
// ============================================================
// HTML (HyperText Markup Language) is the standard language
// used to structure content on the web. It is NOT a programming
// language — it is a *markup* language made up of elements
// (tags) that describe what content IS, not what it does.
// ============================================================

// ------------------------------------------------------------
// 1. DOCUMENT STRUCTURE
// ------------------------------------------------------------
// Every HTML page follows the same skeleton. The browser reads
// this top-to-bottom and builds the page accordingly.

const documentStructure = `
<!DOCTYPE html>           <!-- Tells the browser this is HTML5 -->
<html lang="en">          <!-- Root element; lang helps screen readers -->

<head>
  <!-- The <head> is invisible to users. It holds metadata. -->
  <meta charset="UTF-8">                        <!-- Character encoding -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Page</title>                   <!-- Browser tab title -->
  <link rel="stylesheet" href="styles.css">      <!-- External CSS -->
</head>

<body>
  <!-- Everything the user SEES goes inside <body>. -->
  <h1>Hello, World!</h1>
  <p>This is my first webpage.</p>
</body>

</html>
`;

// Key takeaways:
// • <!DOCTYPE html>  → always first line; activates standards mode
// • <html>           → wraps the entire document
// • <head>           → metadata, title, links to CSS/JS
// • <body>           → visible page content

// ------------------------------------------------------------
// 2. HEADINGS (h1 – h6)
// ------------------------------------------------------------
// Headings create a hierarchy. <h1> is the most important;
// use only ONE <h1> per page. Search engines rely on this order.

const headings = `
<h1>Main Title</h1>         <!-- Largest / most important -->
<h2>Section Title</h2>
<h3>Sub-section</h3>
<h4>Sub-sub-section</h4>
<h5>Minor heading</h5>
<h6>Smallest heading</h6>   <!-- Least important -->
`;

// ------------------------------------------------------------
// 3. PARAGRAPHS, LINE BREAKS & HORIZONTAL RULES
// ------------------------------------------------------------

const textElements = `
<p>This is a paragraph. Browsers add space above and below.</p>
<p>Another paragraph with a<br>line break in the middle.</p>
<hr>  <!-- A thematic break — renders as a horizontal line -->
`;

// <br> is a void element (no closing tag). Use it sparingly —
// for addresses or poems, not for spacing (use CSS instead).

// ------------------------------------------------------------
// 4. LINKS (Anchor Tags)
// ------------------------------------------------------------

const links = `
<!-- External link -->
<a href="https://developer.mozilla.org" target="_blank" rel="noopener">
  MDN Web Docs
</a>

<!-- Internal / relative link -->
<a href="/about.html">About Us</a>

<!-- Email link -->
<a href="mailto:hello@example.com">Email Me</a>

<!-- Jump to a section on the same page -->
<a href="#contact">Go to Contact</a>
<section id="contact">...</section>
`;

// href   → the destination URL
// target → "_blank" opens in a new tab
// rel    → "noopener" prevents security issues with new tabs

// ------------------------------------------------------------
// 5. IMAGES
// ------------------------------------------------------------

const images = `
<img
  src="images/photo.jpg"
  alt="A sunset over the ocean"
  width="600"
  height="400"
>
`;

// • src   → path to the image file (relative or absolute URL)
// • alt   → describes the image for screen readers & broken images
// • width/height → optional; helps the browser reserve space

// ------------------------------------------------------------
// 6. LISTS — Ordered & Unordered
// ------------------------------------------------------------

const lists = `
<!-- Unordered list (bullets) -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<!-- Ordered list (numbers) -->
<ol>
  <li>Preheat oven to 180 °C</li>
  <li>Mix ingredients</li>
  <li>Bake for 25 minutes</li>
</ol>

<!-- Nested list -->
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>
`;

// ------------------------------------------------------------
// 7. ATTRIBUTES — id, class, src, href, alt
// ------------------------------------------------------------
// Attributes add extra information to elements.

const attributes = `
<p id="intro" class="text-large highlight">
  id   → unique identifier (one per page)
  class → reusable label for CSS / JS (many elements can share)
</p>

<a href="https://example.com">href → link destination</a>
<img src="logo.png" alt="Company logo">
<!--  src → file path,  alt → text description -->
`;

// ------------------------------------------------------------
// 8. BLOCK vs INLINE ELEMENTS
// ------------------------------------------------------------
// Block elements start on a new line and take full width.
// Inline elements flow within text and only take needed width.

const blockVsInline = `
<!-- Block elements -->
<div>A generic block container</div>
<p>Paragraph — block</p>
<h2>Heading — block</h2>
<ul><li>List — block</li></ul>

<!-- Inline elements -->
<span>A generic inline container</span>
<a href="#">Link — inline</a>
<strong>Bold — inline</strong>
<em>Italic — inline</em>
<img src="icon.png" alt="icon">  <!-- inline by default -->
`;

// <div>  → group block content (no semantic meaning)
// <span> → group inline content (no semantic meaning)

// ------------------------------------------------------------
// 9. HTML ENTITIES
// ------------------------------------------------------------
// Some characters are reserved in HTML. Use entities instead.

const entities = `
&lt;    →  <   (less than)
&gt;    →  >   (greater than)
&amp;   →  &   (ampersand)
&quot;  →  "   (double quote)
&apos;  →  '   (apostrophe)
&copy;  →  ©   (copyright)
&nbsp;  →      (non-breaking space)
`;

// ------------------------------------------------------------
// 10. PUTTING IT ALL TOGETHER — Simple Personal Page
// ------------------------------------------------------------

const personalPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emmanuel — Personal Page</title>
</head>
<body>

  <h1>Emmanuel Coder</h1>
  <p>Junior Full-Stack Developer based in Nairobi.</p>

  <img src="avatar.jpg" alt="Photo of Emmanuel smiling" width="200">

  <h2>Skills</h2>
  <ul>
    <li>HTML &amp; CSS</li>
    <li>JavaScript</li>
    <li>Node.js</li>
  </ul>

  <h2>Experience</h2>
  <ol>
    <li>Intern at TechCo (2024)</li>
    <li>Freelance projects (2025)</li>
  </ol>

  <hr>

  <p>
    Find me on
    <a href="https://github.com/emmanuel" target="_blank" rel="noopener">
      GitHub
    </a>.
  </p>

</body>
</html>
`;

// ============================================================
// PRACTICE EXERCISES
// ============================================================
//
// 1. Create a template literal containing a valid HTML5 page
//    with a <title>, one <h1>, two <p> tags, and an image.
//
// 2. Build an unordered list of your five favorite foods,
//    then wrap each food name in a link to its Wikipedia page.
//
// 3. Explain in a comment: why should every <img> have an
//    alt attribute? What happens if you leave it out?
//
// 4. Convert this text so it displays correctly in HTML:
//    "5 < 10 & 10 > 5"   (hint: use HTML entities)
//
// 5. Create a nested list that shows two continents, each
//    with three countries underneath.
// ============================================================

console.log("01_html_basics.js loaded ✔");
