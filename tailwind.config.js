/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "surface-container": "#1a2435",
          "on-tertiary": "#063254",
          "on-primary-container": "#052e16",
          "on-primary-fixed-variant": "#065f34",
          "outline-variant": "#374151",
          "tertiary-fixed": "#a7f3d0",
          "background": "#111827",
          "on-tertiary-container": "#002b4c",
          "on-surface": "#f3f4f6",
          "secondary-container": "#ee9800",
          "on-tertiary-fixed": "#001d35",
          "inverse-surface": "#f3f4f6",
          "on-tertiary-fixed-variant": "#25496c",
          "primary-fixed-dim": "#6ee7b7",
          "primary-container": "#059669",
          "on-secondary-container": "#5b3800",
          "on-error": "#690005",
          "surface-container-lowest": "#0d1117",
          "on-secondary": "#472a00",
          "on-surface-variant": "#9ca3af",
          "on-primary-fixed": "#052e16",
          "secondary-fixed-dim": "#ffb95f",
          "surface-variant": "#2d3748",
          "tertiary-fixed-dim": "#a7caf3",
          "surface-dim": "#111827",
          "surface-tint": "#10b981",
          "tertiary": "#a7caf3",
          "surface-container-low": "#1f2937",
          "secondary": "#ffb95f",
          "primary-fixed": "#a7f3d0",
          "on-primary": "#052e16",
          "on-secondary-fixed": "#2a1700",
          "secondary-fixed": "#ffddb8",
          "outline": "#9ca3af",
          "inverse-primary": "#059669",
          "error": "#ffb4ab",
          "surface-container-highest": "#2d3748",
          "surface": "#111827",
          "error-container": "#93000a",
          "surface-container-high": "#243040",
          "on-error-container": "#ffdad6",
          "tertiary-container": "#7194bb",
          "surface-bright": "#374151",
          "inverse-on-surface": "#1f2937",
          "primary": "#10b981",
          "on-secondary-fixed-variant": "#653e00",
          "on-background": "#f3f4f6"
        },
        "borderRadius": {
          "DEFAULT": "0.125rem",
          "lg": "0.25rem",
          "xl": "0.5rem",
          "full": "0.75rem"
        },
        "fontFamily": {
          "sans": ["Inter", "sans-serif"],
          "satoshi": ["Satoshi", "sans-serif"],
          "headline": ["Satoshi", "sans-serif"],
          "body": ["Inter", "sans-serif"],
          "label": ["Inter", "sans-serif"],
          "mono": ["Berkeley Mono", "JetBrains Mono", "monospace"]
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/container-queries')
    ],
  }
