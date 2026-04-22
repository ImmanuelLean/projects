// ============================================
// FRONTEND BUNDLERS (VITE & WEBPACK)
// ============================================

// ---- 1. WHY BUNDLERS? ----
// Browsers can't natively handle: npm modules, TypeScript, JSX, Sass, etc.
// Bundlers transform and bundle your source code for the browser.
// They also provide: dev server, hot reload, code splitting, tree shaking, minification

// ---- 2. VITE (Modern, Fast — Recommended) ----

const viteSetup = `
# Create a new Vite project
npm create vite@latest my-app -- --template react
npm create vite@latest my-app -- --template react-ts    # TypeScript
npm create vite@latest my-app -- --template vanilla

cd my-app
npm install
npm run dev    # Start dev server (http://localhost:5173)
npm run build  # Build for production (output: dist/)
npm run preview # Preview production build locally
`;

// Vite config (vite.config.js)
const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,                    // Auto-open browser
    proxy: {
      // Proxy API calls to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Code splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',                 // Import from @/components/...
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
`;

// Why Vite is fast:
// - Uses native ES modules in development (no bundling!)
// - Only transforms files on demand
// - Uses esbuild for pre-bundling (10-100x faster than Webpack)
// - Uses Rollup for production builds (optimized output)

// ---- 3. WEBPACK (Mature, Configurable) ----

const webpackSetup = `
# Initialize project
npm init -y
npm install webpack webpack-cli webpack-dev-server --save-dev

# Common plugins and loaders
npm install -D html-webpack-plugin css-loader style-loader
npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-react
npm install -D mini-css-extract-plugin css-minimizer-webpack-plugin
`;

// webpack.config.js
const webpackConfig = `
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',    // Cache busting
    clean: true,                             // Clean dist/ before build
  },

  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',             // Built-in asset handling
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],

  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,               // SPA routing
    proxy: [{ context: ['/api'], target: 'http://localhost:5000' }],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },

  optimization: {
    splitChunks: { chunks: 'all' },         // Code splitting
  },
};
`;

// ---- 4. VITE VS WEBPACK ----

const comparison = `
Feature         | Vite                  | Webpack
----------------|----------------------|------------------
Dev server      | Instant (ES modules) | Slower (bundling)
Config          | Minimal              | Verbose
HMR             | Very fast            | Fast
Build           | Rollup               | Webpack
Learning curve  | Easy                 | Steep
Ecosystem       | Growing              | Massive
Best for        | New projects         | Legacy/complex setups
`;

// ---- 5. ENVIRONMENT VARIABLES ----

const envVars = `
# .env
VITE_API_URL=http://localhost:5000    # Vite: must prefix with VITE_
REACT_APP_API_URL=http://localhost:5000  # CRA: prefix with REACT_APP_

# Usage in code:
# Vite:     import.meta.env.VITE_API_URL
# Webpack:  process.env.REACT_APP_API_URL

# .env.development — dev overrides
# .env.production  — prod overrides
# .env.local       — local overrides (git-ignored)
`;

// ---- 6. ESSENTIAL TOOLING ----

const tooling = `
# ESLint (code quality)
npm init @eslint/config
# Creates .eslintrc.json

# Prettier (formatting)
npm install -D prettier eslint-config-prettier
# Creates .prettierrc

# Husky + lint-staged (pre-commit hooks)
npm install -D husky lint-staged
npx husky init

# package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
  }
}
`;

// ---- 7. PROJECT STRUCTURE ----

const structure = `
my-app/
├── public/                # Static files (copied as-is)
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/            # Images, fonts
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API calls
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── App.jsx
│   ├── main.jsx           # Entry point
│   └── index.css
├── .env
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── index.html             # Vite: in root, not public/
├── vite.config.js
└── package.json
`;

console.log("Frontend Bundlers complete!");
console.log("Recommendation: Use Vite for new projects");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a new Vite React project and explore the file structure
// 2. Configure a proxy in vite.config.js to forward /api requests to a backend
// 3. Set up environment variables for API URL in development and production
// 4. Configure path aliases (@/ → src/) in Vite config
// 5. Set up ESLint + Prettier with pre-commit hooks
// 6. Build the project and examine the output in dist/
