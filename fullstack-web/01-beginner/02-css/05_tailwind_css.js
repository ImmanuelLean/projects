// ============================================
// TAILWIND CSS — COMPLETE GUIDE
// ============================================
// Install: npm install -D tailwindcss @tailwindcss/typography
// Docs: https://tailwindcss.com

// ---- 1. SETUP ----

const setup = `
# Vite + React
npm create vite@latest my-app -- --template react
cd my-app
npm install -D tailwindcss @tailwindcss/typography

# Create config
npx tailwindcss init

# tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require("@tailwindcss/typography")],
};

# Add to your CSS (src/index.css)
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// ---- 2. LAYOUT ----

const layout = `
<!-- ===== Container ===== -->
<div class="container mx-auto px-4">Centered content</div>

<!-- ===== Display ===== -->
<div class="block">Block</div>
<span class="inline-block">Inline block</span>
<div class="hidden">Hidden</div>
<div class="flex">Flex container</div>
<div class="grid">Grid container</div>

<!-- ===== Width & Height ===== -->
<div class="w-full">100% width</div>
<div class="w-1/2">50% width</div>
<div class="w-1/3">33% width</div>
<div class="w-64">16rem (256px)</div>
<div class="w-[350px]">Custom 350px</div>
<div class="max-w-xl">Max width xl</div>
<div class="min-h-screen">Min height = viewport</div>
<div class="h-screen">Full viewport height</div>

<!-- ===== Position ===== -->
<div class="relative">
  <div class="absolute top-0 right-0">Top right corner</div>
</div>
<div class="fixed bottom-4 right-4">Floating button</div>
<div class="sticky top-0">Sticky header</div>

<!-- ===== Overflow ===== -->
<div class="overflow-hidden">Clip overflow</div>
<div class="overflow-auto">Scrollable</div>
<div class="overflow-x-scroll">Horizontal scroll</div>

<!-- ===== Z-Index ===== -->
<div class="z-10">z-index: 10</div>
<div class="z-50">z-index: 50</div>
`;

// ---- 3. FLEXBOX ----

const flexbox = `
<!-- ===== Flex Direction ===== -->
<div class="flex flex-row">Horizontal (default)</div>
<div class="flex flex-col">Vertical</div>
<div class="flex flex-row-reverse">Reversed horizontal</div>

<!-- ===== Justify Content (main axis) ===== -->
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-end">End</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>
<div class="flex justify-evenly">Space evenly</div>

<!-- ===== Align Items (cross axis) ===== -->
<div class="flex items-start">Top</div>
<div class="flex items-center">Center</div>
<div class="flex items-end">Bottom</div>
<div class="flex items-stretch">Stretch (default)</div>

<!-- ===== Centering (most common) ===== -->
<div class="flex items-center justify-center h-screen">
  Perfectly centered!
</div>

<!-- ===== Gap ===== -->
<div class="flex gap-4">16px gap between items</div>
<div class="flex gap-x-4 gap-y-2">Different x/y gaps</div>

<!-- ===== Wrap ===== -->
<div class="flex flex-wrap gap-4">Wraps to next line</div>

<!-- ===== Flex Grow / Shrink ===== -->
<div class="flex">
  <div class="flex-none w-20">Fixed width</div>
  <div class="flex-1">Takes remaining space</div>
  <div class="flex-1">Equal share</div>
</div>

<!-- ===== Self Alignment ===== -->
<div class="flex items-start h-32">
  <div class="self-end">I'm at the bottom</div>
</div>

<!-- ===== NAVBAR EXAMPLE ===== -->
<nav class="flex items-center justify-between px-6 py-4 bg-white shadow">
  <a href="/" class="text-xl font-bold">Logo</a>
  <div class="flex items-center gap-6">
    <a href="/about" class="hover:text-blue-600">About</a>
    <a href="/contact" class="hover:text-blue-600">Contact</a>
    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">Sign In</button>
  </div>
</nav>
`;

// ---- 4. GRID ----

const grid = `
<!-- ===== Basic Grid ===== -->
<div class="grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<!-- ===== Responsive Grid ===== -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- 1 col on mobile, 2 on tablet, 3 on laptop, 4 on desktop -->
  <div class="bg-white rounded-lg shadow p-4">Card 1</div>
  <div class="bg-white rounded-lg shadow p-4">Card 2</div>
  <div class="bg-white rounded-lg shadow p-4">Card 3</div>
  <div class="bg-white rounded-lg shadow p-4">Card 4</div>
</div>

<!-- ===== Column Span ===== -->
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">Spans 2 columns</div>
  <div class="col-span-1">1 column</div>
  <div class="col-span-1">1 column</div>
</div>

<!-- ===== Auto Grid ===== -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
  <!-- Auto-filling responsive grid -->
</div>

<!-- ===== Dashboard Layout ===== -->
<div class="grid grid-cols-[250px_1fr] grid-rows-[64px_1fr] h-screen">
  <header class="col-span-2 bg-gray-800">Header</header>
  <aside class="bg-gray-100">Sidebar</aside>
  <main class="p-6 overflow-auto">Content</main>
</div>
`;

// ---- 5. SPACING ----

const spacing = `
<!-- Tailwind spacing scale: 1 unit = 0.25rem = 4px -->
<!-- p = padding, m = margin -->
<!-- t/r/b/l = top/right/bottom/left -->
<!-- x = horizontal (left+right), y = vertical (top+bottom) -->

<div class="p-4">Padding 16px all sides</div>
<div class="px-6 py-3">Padding x:24px y:12px</div>
<div class="pt-2 pb-4">Top 8px, bottom 16px</div>
<div class="m-4">Margin 16px all sides</div>
<div class="mx-auto">Center horizontally</div>
<div class="mt-8 mb-4">Top 32px, bottom 16px</div>
<div class="-mt-4">Negative margin (overlap)</div>
<div class="space-y-4">Gap between children (vertical)</div>
<div class="space-x-4">Gap between children (horizontal)</div>

<!-- Common spacing values:
  0 = 0px      1 = 4px     2 = 8px     3 = 12px
  4 = 16px     5 = 20px    6 = 24px    8 = 32px
  10 = 40px   12 = 48px   16 = 64px   20 = 80px
  24 = 96px   32 = 128px  40 = 160px  64 = 256px
-->
`;

// ---- 6. TYPOGRAPHY ----

const typography = `
<!-- ===== Font Size ===== -->
<p class="text-xs">12px</p>
<p class="text-sm">14px</p>
<p class="text-base">16px (default)</p>
<p class="text-lg">18px</p>
<p class="text-xl">20px</p>
<p class="text-2xl">24px</p>
<p class="text-3xl">30px</p>
<p class="text-4xl">36px</p>
<p class="text-5xl">48px</p>

<!-- ===== Font Weight ===== -->
<p class="font-light">300</p>
<p class="font-normal">400</p>
<p class="font-medium">500</p>
<p class="font-semibold">600</p>
<p class="font-bold">700</p>
<p class="font-extrabold">800</p>

<!-- ===== Text Color ===== -->
<p class="text-gray-500">Gray 500</p>
<p class="text-blue-600">Blue 600</p>
<p class="text-red-500">Red 500</p>
<p class="text-green-600">Green 600</p>
<p class="text-white">White</p>
<p class="text-[#ff6b35]">Custom hex</p>

<!-- ===== Text Alignment ===== -->
<p class="text-left">Left</p>
<p class="text-center">Center</p>
<p class="text-right">Right</p>

<!-- ===== Line Height & Spacing ===== -->
<p class="leading-tight">Tight line height</p>
<p class="leading-relaxed">Relaxed line height</p>
<p class="tracking-wide">Wide letter spacing</p>

<!-- ===== Truncation ===== -->
<p class="truncate">Very long text that will be truncated with ...</p>
<p class="line-clamp-2">Text clamped to 2 lines then truncated...</p>

<!-- ===== Decoration ===== -->
<p class="underline">Underlined</p>
<p class="line-through">Strikethrough</p>
<p class="uppercase">Uppercase</p>
<p class="capitalize">Capitalize each word</p>
<p class="italic">Italic text</p>

<!-- ===== HEADING PATTERN ===== -->
<h1 class="text-4xl font-bold text-gray-900 mb-2">Page Title</h1>
<p class="text-lg text-gray-600 mb-8">Subtitle description goes here</p>
`;

// ---- 7. COLORS & BACKGROUNDS ----

const colors = `
<!-- ===== Background Colors ===== -->
<div class="bg-white">White</div>
<div class="bg-gray-50">Very light gray</div>
<div class="bg-gray-100">Light gray</div>
<div class="bg-gray-900">Near black</div>
<div class="bg-blue-500">Blue</div>
<div class="bg-blue-600 hover:bg-blue-700">Blue with hover</div>
<div class="bg-gradient-to-r from-blue-500 to-purple-600">Gradient</div>
<div class="bg-[#1a1a2e]">Custom color</div>

<!-- ===== Opacity ===== -->
<div class="bg-black/50">50% opacity black</div>
<div class="bg-blue-600/75">75% opacity blue</div>
<div class="text-gray-900/80">80% opacity text</div>

<!-- ===== Borders ===== -->
<div class="border">1px solid border</div>
<div class="border-2 border-blue-500">2px blue border</div>
<div class="border-b border-gray-200">Bottom border only</div>
<div class="rounded">Small radius (4px)</div>
<div class="rounded-lg">Large radius (8px)</div>
<div class="rounded-xl">XL radius (12px)</div>
<div class="rounded-full">Fully rounded (circle/pill)</div>

<!-- ===== Shadows ===== -->
<div class="shadow">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">XL shadow</div>
<div class="shadow-2xl">2XL shadow</div>

<!-- ===== Ring (focus outline) ===== -->
<input class="ring-2 ring-blue-500 focus:ring-4" />
`;

// ---- 8. RESPONSIVE DESIGN ----

const responsive = `
<!-- Tailwind is MOBILE-FIRST: base styles apply to all, then scale up -->
<!-- Breakpoints: sm(640px) md(768px) lg(1024px) xl(1280px) 2xl(1536px) -->

<!-- Stack on mobile, side-by-side on tablet+ -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/3">Sidebar</div>
  <div class="w-full md:w-2/3">Main content</div>
</div>

<!-- Hidden on mobile, visible on desktop -->
<div class="hidden lg:block">Desktop only sidebar</div>

<!-- Different text sizes per breakpoint -->
<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive heading
</h1>

<!-- Different padding per breakpoint -->
<section class="px-4 md:px-8 lg:px-16 py-8 md:py-16">
  Content with responsive padding
</section>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>

<!-- Mobile menu toggle -->
<button class="block md:hidden">☰ Menu</button>
<nav class="hidden md:flex gap-4">
  <a href="#">Home</a>
  <a href="#">About</a>
</nav>
`;

// ---- 9. STATES & INTERACTIVITY ----

const states = `
<!-- ===== Hover ===== -->
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Hover me
</button>

<!-- ===== Focus ===== -->
<input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded px-3 py-2" />

<!-- ===== Active ===== -->
<button class="bg-blue-600 active:bg-blue-800 active:scale-95">
  Press me
</button>

<!-- ===== Disabled ===== -->
<button class="bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>
  Disabled
</button>

<!-- ===== Group Hover ===== -->
<div class="group cursor-pointer p-4 hover:bg-gray-50 rounded-lg">
  <h3 class="font-bold group-hover:text-blue-600">Card Title</h3>
  <p class="text-gray-500 group-hover:text-gray-700">Card description</p>
  <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
</div>

<!-- ===== Peer (sibling state) ===== -->
<input class="peer" placeholder="Email" />
<p class="hidden peer-invalid:block text-red-500 text-sm">Invalid email</p>

<!-- ===== First/Last Child ===== -->
<ul>
  <li class="border-b last:border-b-0 py-2">Item</li>
</ul>

<!-- ===== Odd/Even ===== -->
<tr class="odd:bg-gray-50 even:bg-white">Table row</tr>

<!-- ===== Dark Mode ===== -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Auto dark mode
</div>
`;

// ---- 10. TRANSITIONS & ANIMATIONS ----

const animations = `
<!-- ===== Transitions ===== -->
<button class="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
  Color transition
</button>

<div class="hover:scale-105 transition-transform duration-300 ease-in-out">
  Scale on hover
</div>

<div class="opacity-0 hover:opacity-100 transition-opacity duration-500">
  Fade in
</div>

<!-- All transitions -->
<div class="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
  Card lift effect
</div>

<!-- ===== Built-in Animations ===== -->
<div class="animate-spin">🔄 Spinning</div>
<div class="animate-bounce">⬆️ Bouncing</div>
<div class="animate-pulse">💫 Pulsing (loading skeleton)</div>
<div class="animate-ping">📡 Ping (notification dot)</div>

<!-- ===== Loading Skeleton ===== -->
<div class="animate-pulse space-y-4">
  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
  <div class="h-32 bg-gray-200 rounded"></div>
</div>
`;

// ---- 11. COMPONENT PATTERNS ----

const components = `
<!-- ===== BUTTON VARIANTS ===== -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
  Primary
</button>
<button class="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors">
  Secondary
</button>
<button class="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
  Danger
</button>

<!-- ===== INPUT ===== -->
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
  <input
    type="email"
    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
    placeholder="you@example.com"
  />
  <p class="text-sm text-red-500 mt-1">Please enter a valid email</p>
</div>

<!-- ===== CARD ===== -->
<div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
  <img src="cover.jpg" alt="" class="w-full h-48 object-cover" />
  <div class="p-6">
    <span class="text-xs font-semibold text-blue-600 uppercase tracking-wide">Category</span>
    <h3 class="text-xl font-bold mt-1 text-gray-900">Card Title</h3>
    <p class="text-gray-600 mt-2 line-clamp-2">Description text goes here...</p>
    <div class="flex items-center justify-between mt-4">
      <span class="text-lg font-bold text-gray-900">$29.99</span>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  </div>
</div>

<!-- ===== BADGE ===== -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Active
</span>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  Inactive
</span>

<!-- ===== AVATAR ===== -->
<img class="w-10 h-10 rounded-full object-cover ring-2 ring-white" src="avatar.jpg" alt="User" />

<!-- ===== MODAL OVERLAY ===== -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
    <h2 class="text-xl font-bold mb-4">Modal Title</h2>
    <p class="text-gray-600 mb-6">Modal content goes here</p>
    <div class="flex justify-end gap-3">
      <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirm</button>
    </div>
  </div>
</div>

<!-- ===== FULL PAGE LAYOUT ===== -->
<div class="min-h-screen bg-gray-50 flex flex-col">
  <!-- Navbar -->
  <nav class="bg-white border-b sticky top-0 z-40">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="text-xl font-bold text-gray-900">Brand</a>
      <div class="hidden md:flex items-center gap-6">
        <a href="#" class="text-gray-600 hover:text-gray-900">Features</a>
        <a href="#" class="text-gray-600 hover:text-gray-900">Pricing</a>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="flex-1 container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-12">Welcome</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- cards here -->
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-400 py-12">
    <div class="container mx-auto px-4 text-center">
      © 2025 Brand. All rights reserved.
    </div>
  </footer>
</div>
`;

// ---- 12. TAILWIND WITH REACT ----

const tailwindReact = `
// Reusable components with Tailwind + React

// Button component with variants
function Button({ children, variant = 'primary', size = 'md', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]}\`}
      {...props}
    >
      {children}
    </button>
  );
}

// Usage
<Button variant="primary" size="lg">Save</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost" size="sm">Cancel</Button>

// TIP: Use 'clsx' or 'cn' utility for conditional classes
// npm install clsx tailwind-merge
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-blue-100 border-blue-500',
  isDisabled && 'opacity-50 cursor-not-allowed',
  className, // allow parent override
)} />
`;

// ---- SUMMARY ----
console.log("=== Tailwind CSS Summary ===");
console.log(`
  Core Concepts:
    Utility-first (classes describe style, not semantics)
    Mobile-first responsive (sm: md: lg: xl: 2xl:)
    State variants (hover: focus: active: disabled: dark:)
    Spacing scale (1 unit = 4px)

  Most Used Classes:
    Layout:   flex, grid, container, mx-auto
    Spacing:  p-4, px-6, py-3, m-4, gap-4, space-y-4
    Sizing:   w-full, h-screen, max-w-xl
    Text:     text-lg, font-bold, text-gray-600
    Colors:   bg-blue-600, text-white, border-gray-300
    Borders:  rounded-lg, border, shadow-md
    States:   hover:bg-blue-700, focus:ring-2
    Animate:  transition-all, duration-300, animate-pulse

  Essential Tools:
    clsx + tailwind-merge  — conditional class merging
    @tailwindcss/typography — prose class for markdown
    Tailwind UI             — premium component library
    shadcn/ui               — free copy-paste components
`);
