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
          "surface-container": "#191f2f",
          "on-tertiary": "#063254",
          "on-primary-container": "#00285d",
          "on-primary-fixed-variant": "#004395",
          "outline-variant": "#424754",
          "tertiary-fixed": "#d0e4ff",
          "background": "#0d1322",
          "on-tertiary-container": "#002b4c",
          "on-surface": "#dde2f8",
          "secondary-container": "#ee9800",
          "on-tertiary-fixed": "#001d35",
          "inverse-surface": "#dde2f8",
          "on-tertiary-fixed-variant": "#25496c",
          "primary-fixed-dim": "#adc6ff",
          "primary-container": "#4d8eff",
          "on-secondary-container": "#5b3800",
          "on-error": "#690005",
          "surface-container-lowest": "#080e1d",
          "on-secondary": "#472a00",
          "on-surface-variant": "#c2c6d6",
          "on-primary-fixed": "#001a42",
          "secondary-fixed-dim": "#ffb95f",
          "surface-variant": "#2f3445",
          "tertiary-fixed-dim": "#a7caf3",
          "surface-dim": "#0d1322",
          "surface-tint": "#adc6ff",
          "tertiary": "#a7caf3",
          "surface-container-low": "#151b2b",
          "secondary": "#ffb95f",
          "primary-fixed": "#d8e2ff",
          "on-primary": "#002e6a",
          "on-secondary-fixed": "#2a1700",
          "secondary-fixed": "#ffddb8",
          "outline": "#8c909f",
          "inverse-primary": "#005ac2",
          "error": "#ffb4ab",
          "surface-container-highest": "#2f3445",
          "surface": "#0d1322",
          "error-container": "#93000a",
          "surface-container-high": "#242a3a",
          "on-error-container": "#ffdad6",
          "tertiary-container": "#7194bb",
          "surface-bright": "#33394a",
          "inverse-on-surface": "#2a3040",
          "primary": "#adc6ff",
          "on-secondary-fixed-variant": "#653e00",
          "on-background": "#dde2f8"
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
