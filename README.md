# UI Lab — Component & Microinteraction Library

> A component playground and microinteraction library built with pure HTML, CSS, and Vanilla JavaScript. Browse buttons, cards, toggles, toasts, inputs, modals, and navigation patterns — all with live previews and copy-ready code snippets. No frameworks, no build step.

**Live demo:** https://taras-polishchuk.github.io/ui-lab/

---

## Features

- **10 component categories** — Buttons, Cards, Inputs, Toggles, Toasts, Navigation, Modals, Search, Loaders, and more
- **Live interactive previews** — every component is rendered and interactive in the browser
- **Copy-to-clipboard** — copy the HTML/CSS code for any component in one click
- **Control panel** — adjust global theme, spacing, and animation speed
- **Dark theme** — all components designed against a dark background
- **State management** — lightweight custom store (`state/store.js`) for cross-component state
- **Modular JS architecture** — each component category has its own module in `js/components/`
- **CSS design tokens** — consistent spacing, color, radius, and animation values via CSS custom properties
- **Zero dependencies** — no npm, no bundler, opens straight in a browser

## Tech stack

| Layer | Detail |
|-------|--------|
| Markup | Semantic HTML5 |
| Styles | CSS custom properties, modular CSS files |
| Logic | Vanilla JavaScript ES6 modules |
| Architecture | Component-based JS modules + centralized state store |

## Project structure

```
ui_lab/
├── index.html
├── css/
│   ├── tokens.css        # design tokens (colors, spacing, radius, etc.)
│   ├── base.css          # reset & global styles
│   ├── layout.css        # page layout & grid
│   ├── components.css    # shared component base styles
│   ├── animations.css    # keyframes & transition utilities
│   └── utilities.css     # helper classes
└── js/
    ├── main.js           # entry point — initializes all components
    ├── components/
    │   ├── buttons.js
    │   ├── cards.js
    │   ├── inputs.js
    │   ├── toggles.js
    │   ├── toasts.js
    │   ├── modal.js
    │   ├── navigation.js
    │   ├── search.js
    │   ├── background.js
    │   └── controlpanel.js
    ├── state/
    │   └── store.js      # simple pub/sub state store
    └── utils/
        ├── dom.js         # DOM helpers
        └── animate.js     # animation utilities
```

## How to run

Open `index.html` directly in any modern browser — no server or build step required.

```bash
open index.html        # macOS
xdg-open index.html    # Linux
```

> Note: because the JS uses ES modules (`type="module"`), you may need a local server if opening via `file://` on some browsers:
> ```bash
> npx serve .
> # or
> python3 -m http.server 8080
> ```

## How to use

1. Click any component category in the sidebar to navigate to it
2. Interact with the live component preview
3. Click the **Copy** button to grab the code
4. Use the **Control Panel** to toggle global theme or animation settings

## Motivation

Built to practice writing clean, modular Vanilla JS without relying on frameworks — and to have a personal library of reusable UI patterns and microinteractions ready to drop into projects.
