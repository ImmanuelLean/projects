// ============================================
// STYLING, IMAGES, FONTS & OPTIMIZATION
// ============================================

const images = `
// ===== next/image — Automatic optimization =====
import Image from 'next/image';

// Local image (auto width/height)
import heroImage from '@/public/images/hero.jpg';

function Hero() {
  return (
    <Image
      src={heroImage}
      alt="Hero banner"
      priority              // preload (above the fold)
      placeholder="blur"    // blur placeholder while loading
      className="w-full h-[400px] object-cover"
    />
  );
}

// Remote image (must specify dimensions)
function Avatar({ url, name }: { url: string; name: string }) {
  return (
    <Image
      src={url}
      alt={name}
      width={48}
      height={48}
      className="rounded-full"
    />
  );
}

// Fill container (responsive)
function CardImage({ src }: { src: string }) {
  return (
    <div className="relative w-full h-48">
      <Image
        src={src}
        alt=""
        fill                         // fills parent container
        sizes="(max-width: 768px) 100vw, 33vw"  // responsive hints
        className="object-cover rounded-t-lg"
      />
    </div>
  );
}

// next.config.js — allow remote image domains
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
};
`;

const fonts = `
// ===== next/font — Zero layout shift fonts =====
import { Inter, Roboto_Mono, Playfair_Display } from 'next/font/google';

// Variable font (recommended)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Specific weights
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${robotoMono.variable}\`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// Use in Tailwind
// tailwind.config.ts
// fontFamily: {
//   sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
//   mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
// }
`;

const styling = `
// ===== CSS Modules =====
// components/Button.module.css
.button { background: blue; color: white; padding: 8px 16px; border-radius: 8px; }
.button:hover { background: darkblue; }
.primary { background: #2563eb; }
.danger { background: #dc2626; }

// components/Button.tsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children }) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  );
}

// ===== Tailwind (Recommended) =====
// Already set up with create-next-app --tailwind
// Just use utility classes directly

// ===== Global CSS =====
// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors;
  }
  .input-field {
    @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none;
  }
}
`;

const optimization = `
// ===== Performance Optimization =====

// 1. Lazy loading components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />,
  ssr: false,  // only load on client (for browser-only libs)
});

// 2. Script optimization
import Script from 'next/script';

<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXX"
  strategy="lazyOnload"  // load after page is interactive
/>

// 3. Link prefetching (automatic for visible links)
import Link from 'next/link';
<Link href="/about" prefetch={true}>About</Link>  // prefetch on hover
<Link href="/heavy-page" prefetch={false}>Skip prefetch</Link>
`;

console.log("=== Next.js Styling & Optimization ===");
console.log("next/image, next/font, CSS modules, Tailwind, lazy loading, Script");

export {};
