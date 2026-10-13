/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        // Accent
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        // Backgrounds
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        // Text
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        // Borders
        border: 'var(--color-border)',
        // Semantic
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        'active-tab': 'var(--color-active-tab)',
        // Tiles
        tile: {
          client: {
            bg: 'var(--color-tile-client-bg)',
            border: 'var(--color-tile-client-border)',
            icon: 'var(--color-tile-client-icon)',
            text: 'var(--color-tile-client-text)',
          },
          site: {
            bg: 'var(--color-tile-site-bg)',
            border: 'var(--color-tile-site-border)',
            icon: 'var(--color-tile-site-icon)',
            text: 'var(--color-tile-site-text)',
          },
          worker: {
            bg: 'var(--color-tile-worker-bg)',
            border: 'var(--color-tile-worker-border)',
            icon: 'var(--color-tile-worker-icon)',
            text: 'var(--color-tile-worker-text)',
          },
        },
      },
    },
  },
  plugins: [],
};
