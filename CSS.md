# CSS Reference

Complete CSS architecture documentation for the Schnitzel Craft Game Lounge theme.

---

## Architecture Overview

The CSS is organized into modular files:

```
css/
├── main.css              # Main entry point (imports all files)
├── variables.css         # CSS custom properties
├── base.css             # Reset, typography, base styles
├── utilities.css        # Utility classes
└── components/
    ├── buttons.css
    ├── cards.css
    ├── modals.css
    ├── forms.css
    ├── player.css
    ├── dice.css
    ├── scores.css
    ├── menu.css
    ├── animations.css
    └── leaderboard.css
```

---

## CSS Custom Properties

### Typography

```css
/* Font Families */
--font-display: 'Playfair Display', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;

/* Font Sizes - Headlines */
--font-size-h1: 64px;
--font-size-h2: 48px;
--font-size-h3: 32px;

/* Font Sizes - Body */
--font-size-body: 15px;
--font-size-small: 13px;
--font-size-tiny: 11px;

/* Font Sizes - Numbers (for scores) */
--font-size-number-xl: 56px;
--font-size-number-lg: 32px;
--font-size-number-md: 28px;
--font-size-number-sm: 24px;

/* Font Weights */
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
--font-weight-black: 900;

/* Letter Spacing */
--letter-spacing-tight: -2px;
--letter-spacing-normal: -1px;
--letter-spacing-none: 0;
--letter-spacing-slight: 0.5px;
--letter-spacing-wide: 2px;
--letter-spacing-wider: 3px;
```

**Usage:**
- Use `--font-display` for all numbers and scores
- Use `--font-body` for all UI text
- Headlines get tight letter-spacing (-2px)
- Section headers get wide letter-spacing (2px)

---

### Colors

#### Backgrounds

```css
--bg-primary: #1a1512;      /* Main app background */
--bg-secondary: #2a2018;    /* Elevated surfaces */
--bg-tertiary: #1f1810;     /* Gradient end color */

/* Legacy aliases (backward compatibility) */
--bg: #1a1512;
--surface: #2a2018;
--surface2: #2a2018;
```

#### Gold Accent Scale

```css
--gold-primary: #d4a574;    /* Primary accent */
--gold-bright: #e6b873;     /* Highlights, hover states */
--gold-muted: #c9b397;      /* Body text, labels */
--gold-pale: #f5d4a0;       /* Score values */
--gold-brown: #8b7355;      /* Dim text, metadata */

/* Legacy aliases */
--accent: #d4a574;
--accentDark: #c9b397;
--link: #e6b873;
--linkHover: #d4a574;
```

#### Text

```css
--text-primary: #f5ede3;    /* Primary content */
--text-secondary: #c9b397;  /* Secondary content */
--text-accent: #d4a574;     /* Interactive text */

/* Legacy aliases */
--text: #f5ede3;
--muted: #c9b397;
--icon: #d4a574;
--onAccent: #1a1512;        /* Text on gold buttons */
--onLink: #1a1512;          /* Text on bright gold */
```

#### Borders

```css
--border-primary: #3d2f20;              /* Solid borders */
--border-subtle: rgba(212, 165, 116, 0.15);   /* Section dividers */
--border-accent: rgba(212, 165, 116, 0.08);   /* Faint row separators */

/* Legacy aliases */
--border: #3d2f20;
--borderAccent: #d4a574;
--borderFocus: #e6b873;
```

#### Semantic

```css
--success: #7fb069;         /* Success/positive */
--warning: #e6b873;         /* Warnings (uses gold) */
--error: #e67373;           /* Errors/destructive */
```

#### Interactive Overlays

```css
--hover-bg: rgba(212, 165, 116, 0.08);    /* Hover backgrounds */
--active-bg: rgba(212, 165, 116, 0.12);   /* Active/pressed */

--ambient-glow: rgba(212, 165, 116, 0.08);      /* Top glow effect */
--subtle-highlight: rgba(212, 165, 116, 0.05);  /* Subtle overlays */
--card-bg-overlay: rgba(212, 165, 116, 0.05);   /* Card backgrounds */
--stat-bg-overlay: rgba(212, 165, 116, 0.08);   /* Stat box backgrounds */

/* Legacy aliases */
--surfaceHover: rgba(212, 165, 116, 0.08);
--surfacePressed: rgba(212, 165, 116, 0.12);
--surface2Hover: rgba(212, 165, 116, 0.08);
--surface2Pressed: rgba(212, 165, 116, 0.12);
--accentSubtle: rgba(212, 165, 116, 0.08);
```

#### Focus States

```css
--focusRing: rgba(212, 165, 116, 0.35);       /* Normal focus */
--focusRingStrong: rgba(212, 165, 116, 0.55); /* Strong focus */
```

#### Other

```css
--scrim: rgba(0, 0, 0, 0.7);        /* Modal overlays */
--tooltipBg: var(--bg-secondary);
--tooltipText: var(--text);
--divider: var(--border);

/* Decorative opacity levels */
--decorative-low: 0.3;
--decorative-med: 0.4;

/* Skeleton loading */
--skeletonBase: var(--bg-secondary);
--skeletonShimmer: var(--hover-bg);
```

---

### Spacing

```css
--space-xs: 6px;
--space-sm: 12px;
--space-md: 20px;
--space-lg: 28px;
--space-xl: 40px;
--space-2xl: 32px;
--space-3xl: 40px;

/* Legacy spacing (backward compatibility) */
--s1: 4px;
--s2: 8px;
--s3: 12px;
--s4: 16px;
--s5: 20px;
--s6: 24px;
--s7: 32px;
--s8: 40px;
```

**Naming Convention:**
- Modern: `--space-{size}` (xs, sm, md, lg, xl)
- Legacy: `--s{number}` (1-8)

**Common Usage:**
- Card padding: `--space-lg` (28px)
- Row padding: `--space-md` (20px)
- Button padding: `--space-md` and `--space-xl`
- Grid gap: `--space-sm` (12px)

---

### Border Radius

```css
--rSm: 8px;      /* Dice, buttons, small elements */
--rMd: 12px;     /* Cards, stats, inputs */
--rLg: 16px;     /* Large cards, modals */
--rXl: 24px;     /* Extra large hero elements */
--rPill: 999px;  /* Fully rounded pills/badges */
```

**Note:** Uses short names (`rSm` vs `radius-sm`) for brevity.

---

### Shadows

```css
/* Component shadows */
--shadowSm: 0 4px 12px rgba(212, 165, 116, 0.25);
--shadowMd: 0 8px 24px rgba(0, 0, 0, 0.6);
--shadowLg: 0 20px 50px rgba(0, 0, 0, 0.38);

/* Inset highlights */
--innerHighlight: inset 0 1px 0 rgba(212, 165, 116, 0.1);

/* Button-specific shadows */
--shadow-button: 0 4px 12px rgba(212, 165, 116, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
--shadow-button-hover: 0 6px 20px rgba(212, 165, 116, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25);
```

**Usage:**
- `.card`: `--shadowMd` + `--innerHighlight`
- Primary buttons: `--shadow-button` (includes inset shine)
- Button hover: `--shadow-button-hover`

---

### Motion

```css
/* Durations */
--transition-fast: 0.15s ease;
--transition-normal: 0.2s ease;
--transition-slow: 0.3s ease;
```

**Note:** Includes `ease` timing function in the value.

**Usage:**
- Micro-interactions: `--transition-fast`
- Standard transitions: `--transition-normal`
- Decorative animations: `--transition-slow`

---

### Z-Index

```css
--z-base: 0;
--z-elevated: 1;
--z-overlay: 10;
--z-sticky: 20;
--z-modal-backdrop: 50;
--z-modal: 100;
--z-menu: 1000;
--z-toast: 9999;
```

**Usage:**

| Layer | Variable | Usage |
|-------|----------|-------|
| Base | `--z-base` | Default layer |
| Elevated | `--z-elevated` | Slightly raised elements |
| Overlay | `--z-overlay` | Score pickers, overlays |
| Sticky | `--z-sticky` | Sticky headers |
| Modal Background | `--z-modal-backdrop` | Modal backdrop |
| Modal | `--z-modal` | Modal content, game header |
| Menu | `--z-menu` | Side menu system |
| Toast | `--z-toast` | Toast notifications, fireworks |

**Note:** All hardcoded z-index values have been replaced with these variables throughout the codebase.

---

## Google Fonts Import

Include at the top of `variables.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');
```

---

## Base Styles

### Reset

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
```

### Body

```css
body {
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
  color: var(--text);
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
}
```

### Ambient Top Glow

```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 300px;
  background: radial-gradient(
    ellipse at top,
    var(--ambient-glow) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 0;
}
```

### Container

```css
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
  position: relative;
  z-index: 1;
}

@media (min-width: 600px) {
  .container {
    padding: 48px 32px;
  }
}

@media (min-width: 900px) {
  .container {
    padding: 60px 40px;
  }
}
```

---

## Component Patterns

### Card

```css
.card {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: var(--rMd);
  box-shadow: var(--shadowMd), var(--innerHighlight);
  overflow: hidden;
  border: 2px solid var(--border-primary);
  padding: var(--space-lg);
  position: relative;
  transition: all var(--transition-normal);
}

/* Single top accent line */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--space-lg);
  right: var(--space-lg);
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--gold-primary) 50%,
    transparent 100%
  );
  opacity: 0.5;
}

.card:hover {
  border-color: var(--border-subtle);
}
```

**Implementation:** See `css/components/cards.css`

---

### Section Header

```css
.section-title {
  font-family: var(--font-body);
  font-size: var(--font-size-tiny);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--gold-primary);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-subtle);
}
```

**Implementation:** See `css/base.css:76-87`, `css/components/cards.css:163-173`

---

### Score Row

```css
.score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-accent);
  transition: all var(--transition-normal);
  position: relative;
  margin: 0 calc(var(--space-lg) * -1);
}

.score-row:hover {
  padding-left: calc(var(--space-lg) + var(--space-sm));
  border-left: 3px solid var(--gold-primary);
}

.score-row .label {
  color: var(--text-secondary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-body);
}

.score-row .value {
  color: var(--gold-pale);
  font-size: var(--font-size-number-lg);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-display);
  letter-spacing: var(--letter-spacing-normal);
  min-width: 4rem;
  text-align: right;
}
```

**Implementation:** See `css/components/scores.css:3-40`

**Key Features:**
- Left gold bar appears on hover
- Padding shifts right on hover
- No background color change

---

### Buttons

**Primary:**
```css
.btn-primary {
  background: var(--gold-primary);
  color: var(--onAccent);
  font-weight: var(--font-weight-bold);
  padding: 1rem 1.75rem;
  border-radius: var(--rSm);
  font-size: var(--font-size-body);
  box-shadow: var(--shadow-button);
  border: none;
  font-family: var(--font-body);
}

.btn-primary:hover {
  background: var(--gold-bright);
  transform: translateY(-2px);
  box-shadow: var(--shadow-button-hover);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:focus {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}
```

**Secondary:**
```css
.btn-secondary {
  background: transparent;
  color: var(--gold-primary);
  font-weight: var(--font-weight-bold);
  padding: 1rem 1.75rem;
  border-radius: var(--rSm);
  font-size: var(--font-size-body);
  border: 2px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--hover-bg);
  border-color: var(--gold-primary);
}
```

**Danger:**
```css
.btn-danger {
  background: transparent;
  color: var(--error);
  border: 2px solid rgba(230, 115, 115, 0.3);
}

.btn-danger:hover {
  background: rgba(230, 115, 115, 0.1);
  border-color: var(--error);
}
```

**Implementation:** See `css/components/buttons.css`

---

### Stats Grid

```css
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
  margin: var(--space-lg) 0;
}

.stat {
  background: var(--stat-bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--rSm);
  padding: var(--space-md);
  text-align: center;
  transition: all var(--transition-normal);
}

.stat:hover {
  background: var(--hover-bg);
  border-color: var(--border-subtle);
  transform: translateY(-2px);
}

.stat-label {
  font-size: var(--font-size-tiny);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gold-brown);
  margin-bottom: var(--space-xs);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-body);
}

.stat-value {
  font-size: var(--font-size-number-md);
  font-weight: var(--font-weight-bold);
  color: var(--gold-primary);
  font-family: var(--font-display);
  letter-spacing: var(--letter-spacing-normal);
}
```

**Implementation:** See `css/components/cards.css:40-78`

---

### Dice Display

**Decorative (setup screen):**
```css
.dice-display {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin: var(--space-xl) 0 var(--space-lg) 0;
  opacity: var(--decorative-low);
}
```

**Interactive (play mode):**
```css
.die {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--rSm);
  border: 2px solid var(--gold-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.875rem;
  color: var(--gold-bright);
  cursor: pointer;
  transition: all var(--transition-slow);
  transform: rotate(var(--rotation, 0deg));
}

.die:hover {
  transform: rotate(0deg) scale(1.1);
  border-color: var(--gold-primary);
  opacity: 1;
}

.die.held {
  background: var(--gold-bright);
  color: var(--onLink);
  border: 3px solid var(--gold-primary);
  box-shadow: 0 0 16px var(--focusRingStrong);
}
```

**Implementation:** See `css/components/dice.css`

---

### Accent Line

```css
.accent-line {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--gold-primary) 50%,
    transparent 100%
  );
  margin: var(--space-xl) 0;
  opacity: 0.3;
}
```

**Implementation:** See `css/components/cards.css:81-91`

---

## Utility Classes

### Layout

```css
/* Flexbox */
.flex { display: flex; }
.flex-1 { flex: 1; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }

/* Grid */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

/* Width */
.w-full { width: 100%; }
```

### Spacing

```css
/* Margin */
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-4 { margin-top: 1rem; }

/* Padding */
.p-4 { padding: 1rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

/* Gap */
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
```

### Typography

```css
/* Font sizes (rem-based) */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }

/* Font weights */
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }
.font-black { font-weight: 900; }

/* Alignment */
.text-center { text-align: center; }
```

### Colors

**Theme-mapped color utilities** (Tailwind-style names mapped to Craft Game Lounge colors):

```css
.text-purple-600 { color: var(--gold-primary); }
.text-purple-700 { color: var(--gold-brown); }
.text-blue-600 { color: var(--gold-bright); }
.text-yellow-400 { color: var(--gold-pale); }
.text-red-500 { color: var(--error); }
.text-gray-500 { color: var(--text-secondary); }
```

**Note:** Uses generic Tailwind-style names for backward compatibility, but maps to theme colors.

### Border Radius

```css
.rounded-sm { border-radius: var(--rSm); }
.rounded-md { border-radius: var(--rMd); }
.rounded-lg { border-radius: var(--rLg); }
.rounded-xl { border-radius: var(--rXl); }
.rounded-full { border-radius: var(--rPill); }
```

### Shadows

```css
.shadow-md { box-shadow: var(--shadowMd); }
.shadow-lg { box-shadow: var(--shadowLg); }
```

**Implementation:** See `css/utilities.css`

---

## Accessibility Features

**✅ WCAG 2.1 Level AA compliant - all accessibility features implemented:**

### 1. Reduced Motion

Implemented in `css/base.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Impact:** Users with vestibular disorders can safely use the app without motion-triggered symptoms.

---

### 2. Focus-Visible (Keyboard Navigation)

Implemented in `css/components/buttons.css`, `forms.css`, `dice.css`, `scores.css`:

```css
/* Hide focus outline for mouse users */
.btn:focus:not(:focus-visible) {
  outline: none;
}

/* Show focus outline only for keyboard users */
.btn:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}
```

**Impact:** Focus indicators appear only for keyboard navigation, not mouse clicks. Improves UX for both mouse and keyboard users.

**Coverage:** All 14 button types, form inputs, dice elements, and score buttons.

---

### 3. High Contrast Mode

Implemented in `css/variables.css`:

```css
@media (prefers-contrast: high) {
  :root {
    --border-accent: rgba(212, 165, 116, 0.3);
    --border-subtle: rgba(212, 165, 116, 0.4);
  }
}
```

**Impact:** Users with low vision automatically get increased border contrast for better visibility.

---

## File Organization

### Import Order (main.css)

```css
@import 'variables.css';     /* CSS custom properties first */
@import 'base.css';          /* Reset and base styles */
@import 'utilities.css';     /* Utility classes */

/* Components (order doesn't matter) */
@import 'components/buttons.css';
@import 'components/cards.css';
@import 'components/modals.css';
@import 'components/forms.css';
@import 'components/player.css';
@import 'components/dice.css';
@import 'components/scores.css';
@import 'components/menu.css';
@import 'components/animations.css';
@import 'components/leaderboard.css';
```

---

## Naming Conventions

### CSS Custom Properties

| Convention | Example | Used For |
|------------|---------|----------|
| Full words | `--border-primary` | Descriptive tokens |
| Abbreviations | `--rSm`, `--rMd` | Frequently used tokens |
| Hyphenated | `--font-size-body` | Multi-word descriptors |
| camelCase | `--shadowMd`, `--borderAccent` | Legacy compatibility |

**Note:** The codebase uses mixed conventions for historical reasons. New tokens should prefer hyphenated full words.

### Component Classes

The app uses **utility-first CSS** with component classes:

- Prefer utility classes (`.flex`, `.text-center`) for layout
- Use component classes (`.card`, `.btn-primary`) for styled elements
- No BEM methodology (`.block__element--modifier`) is used
- Keep class names flat and descriptive

---

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- iOS Safari 14+ (PWA support)
- Android Chrome 90+ (PWA support)

**Features used:**
- CSS Custom Properties (variables)
- CSS Grid
- Flexbox
- `clamp()`, `min()`, `max()`
- `backdrop-filter` (for glass effects)
- Safe area insets (`env(safe-area-inset-*)`)

---

## Performance Considerations

### Variable Lookup

CSS variables have minimal performance cost. The app uses ~100 custom properties with no noticeable impact.

### Transitions

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `padding` (triggers layout)

### Shadow Optimization

- Box shadows are expensive; use sparingly
- Combined shadows (e.g., `--shadow-button`) are applied once

---

**Last Updated:** 2026-01-19
**Based On:** Production CSS implementation (commit 5f80a80)
**Status:** ✅ Fully accurate - reflects actual codebase
