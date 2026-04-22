// ============================================================
// 03 — SEMANTIC HTML
// ============================================================
// "Semantic" means "relating to meaning." Semantic HTML uses
// elements that DESCRIBE their content, not just how it looks.
//
// WHY IT MATTERS:
//   1. Accessibility — screen readers can navigate by landmarks
//   2. SEO — search engines understand your page structure
//   3. Readability — developers instantly know what each block does
//   4. Maintainability — easier to style and refactor
// ============================================================

// ------------------------------------------------------------
// 1. THE PROBLEM WITH <div> SOUP
// ------------------------------------------------------------
// Without semantic elements, pages end up like this:

const divSoup = `
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">
  <div class="article">...</div>
  <div class="sidebar">...</div>
</div>
<div class="footer">...</div>
`;

// Every block is a meaningless <div>. A screen reader cannot
// tell a navigation list from a sidebar. Search engines must
// guess. Developers must read class names to understand layout.

// ------------------------------------------------------------
// 2. SEMANTIC ELEMENTS — THE BETTER WAY
// ------------------------------------------------------------
// HTML5 introduced elements that carry built-in meaning.

const semanticOverview = `
<header>   — introductory content or navigation for a section
<nav>      — a set of navigation links
<main>     — the dominant content of the page (only ONE per page)
<section>  — a thematic grouping of content (with a heading)
<article>  — self-contained content (blog post, news story, comment)
<aside>    — tangentially related content (sidebar, pull-quote)
<footer>   — footer for the nearest sectioning ancestor
<figure>   — self-contained media (image, chart, code snippet)
<figcaption> — caption for a <figure>
<details>  — disclosure widget the user can open/close
<summary>  — visible heading for a <details> block
<time>     — machine-readable date/time
<mark>     — highlighted / relevant text
`;

// ------------------------------------------------------------
// 3. EACH ELEMENT IN DETAIL
// ------------------------------------------------------------

// --- <header> & <footer> ---
const headerFooter = `
<header>
  <h1>My Blog</h1>
  <p>Thoughts on web development</p>
</header>

<footer>
  <p>&copy; 2026 Emmanuel Coder. All rights reserved.</p>
</footer>
`;
// A page can have multiple <header>/<footer> elements — e.g.
// one for the page AND one inside each <article>.

// --- <nav> ---
const nav = `
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
`;
// Use <nav> only for MAJOR navigation blocks, not every link group.

// --- <main> ---
const main = `
<main>
  <!-- The primary content unique to this page -->
  <h2>Latest Articles</h2>
  <article>...</article>
  <article>...</article>
</main>
`;
// Only ONE <main> per page. Skip links ("Skip to content")
// should point here for keyboard users.

// --- <section> vs <article> ---
const sectionVsArticle = `
<!-- <section> groups related content under a heading -->
<section>
  <h2>Featured Projects</h2>
  <p>Here are some things I've built...</p>
</section>

<!-- <article> is self-contained — it makes sense on its own -->
<article>
  <h2>Understanding Closures in JS</h2>
  <time datetime="2026-04-15">April 15, 2026</time>
  <p>A closure is a function that remembers...</p>
</article>
`;
// Rule of thumb: if the content could be syndicated (RSS, embed),
// it's an <article>. If it's just a themed group, use <section>.

// --- <aside> ---
const aside = `
<aside>
  <h3>Related Links</h3>
  <ul>
    <li><a href="/html-tips">10 HTML Tips</a></li>
    <li><a href="/css-grid">CSS Grid Guide</a></li>
  </ul>
</aside>
`;

// --- <figure> & <figcaption> ---
const figure = `
<figure>
  <img src="chart.png" alt="Bar chart of monthly revenue">
  <figcaption>Figure 1: Monthly revenue for Q1 2026</figcaption>
</figure>
`;

// --- <details> & <summary> ---
const details = `
<details>
  <summary>What is semantic HTML?</summary>
  <p>Semantic HTML uses elements that convey meaning about the
     content they contain, improving accessibility and SEO.</p>
</details>
`;
// The content is hidden by default; clicking <summary> toggles it.

// --- <time> & <mark> ---
const timeMark = `
<p>Published on <time datetime="2026-04-21">April 21, 2026</time></p>
<p>The most important rule: <mark>always validate on the server</mark>.</p>
`;

// ------------------------------------------------------------
// 4. ARIA ROLES & BASIC ACCESSIBILITY
// ------------------------------------------------------------
// ARIA (Accessible Rich Internet Applications) adds extra
// semantics when native HTML isn't enough.

const ariaExamples = `
<!-- aria-label provides an accessible name -->
<button aria-label="Close dialog">✕</button>

<!-- role overrides or supplements the element's default role -->
<div role="alert">Your changes have been saved.</div>

<!-- aria-hidden removes decorative content from the a11y tree -->
<span aria-hidden="true">🎉</span>

<!-- alt text for images (NOT aria, but critical for a11y) -->
<img src="hero.jpg" alt="Team collaborating around a whiteboard">

<!-- Decorative images get an empty alt to be skipped -->
<img src="divider.png" alt="">
`;

// Golden rules:
// 1. Use native semantic elements FIRST — they have built-in roles.
// 2. Add ARIA only when no HTML element fits the purpose.
// 3. Every interactive element must be keyboard-accessible.

// ------------------------------------------------------------
// 5. HEADING HIERARCHY & DOCUMENT OUTLINE
// ------------------------------------------------------------
// Headings create a logical outline. Never skip levels.

const headingHierarchy = `
<h1>Site Title</h1>              <!-- level 1 — one per page -->
  <h2>About</h2>                 <!-- level 2 section -->
  <h2>Blog</h2>                  <!-- another level 2 -->
    <h3>Post Title</h3>          <!-- level 3 under Blog -->
    <h3>Another Post</h3>
  <h2>Contact</h2>

<!-- ✗ BAD — jumping from h2 to h4 -->
<h2>Services</h2>
<h4>Consulting</h4>              <!-- skipped h3! -->
`;

// Screen reader users often navigate by heading level, so
// a broken hierarchy makes the page confusing.

// ------------------------------------------------------------
// 6. FULL SEMANTIC PAGE LAYOUT
// ------------------------------------------------------------

const semanticPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emmanuel's Dev Blog</title>
</head>
<body>

  <header>
    <h1>Emmanuel's Dev Blog</h1>
    <nav aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h2>Latest Articles</h2>

      <article>
        <h3>Getting Started with Semantic HTML</h3>
        <time datetime="2026-04-21">April 21, 2026</time>
        <p>Semantic HTML improves accessibility and SEO by
           giving meaning to your markup...</p>
        <figure>
          <img src="semantic.png" alt="Diagram comparing div soup to semantic layout">
          <figcaption>Semantic layout vs. div soup</figcaption>
        </figure>
      </article>

      <article>
        <h3>Why Accessibility Matters</h3>
        <time datetime="2026-04-18">April 18, 2026</time>
        <p>Over 1 billion people worldwide live with some form
           of disability. Building accessible websites is not
           optional — it's a responsibility.</p>
      </article>
    </section>

    <aside>
      <h2>About Me</h2>
      <p>Full-stack developer from Nairobi who loves clean code.</p>

      <details>
        <summary>Fun fact</summary>
        <p>I wrote my first HTML page at age 14!</p>
      </details>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Emmanuel Coder</p>
    <nav aria-label="Footer">
      <a href="/privacy">Privacy Policy</a> |
      <a href="/terms">Terms of Service</a>
    </nav>
  </footer>

</body>
</html>
`;

// ============================================================
// PRACTICE EXERCISES
// ============================================================
//
// 1. Take the "div soup" example from Section 1 and rewrite
//    it using proper semantic elements.
//
// 2. Create a blog post page with: <header>, <main> containing
//    one <article> (with <time>, heading, paragraphs, and a
//    <figure>), an <aside> with related links, and a <footer>.
//
// 3. Add a <details>/<summary> FAQ section with at least
//    three questions and answers.
//
// 4. Review one of your earlier HTML files. Identify any
//    places where you used <div> or <span> that could be
//    replaced with a semantic element. List them in a comment.
//
// 5. Explain in a comment: what is the difference between
//    aria-label and the alt attribute? When do you use each?
//
// 6. Create a page outline (just headings, no content) for an
//    e-commerce product page. Ensure no heading levels are
//    skipped and the hierarchy makes logical sense.
// ============================================================

console.log("03_semantic_html.js loaded ✔");
