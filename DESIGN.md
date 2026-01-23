# Schnitzel Design System

## Craft Game Lounge

**Version**: 1.0
**Theme**: Tavern Modern

---

## Design Philosophy

The Schnitzel app embodies **"Craft Game Lounge"** - a modern board game café aesthetic that balances contemporary design with warm, inviting atmosphere.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Contemporary Warmth** | Clean lines and sophisticated typography, cozy and inviting |
| **Premium Simplicity** | Upscale feel through restraint, not decoration |
| **Gemütlich Modernism** | Intimate and comfortable with purposeful minimalism |
| **Typographic Hierarchy** | Typography carries visual interest, not ornament |

### Design DNA

Think upscale craft brewery that renovated an old building while respecting its history:
- Sophisticated but approachable
- Playful without being childish
- Premium without pretension
- Modern with warmth

---

## Color Tokens

### Backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#1a1512` | Main app background |
| `--bg-elevated` | `#2a2018` | Cards, modals, elevated surfaces |
| `--bg-elevated-gradient` | `linear-gradient(135deg, #2a2018 0%, #1f1810 100%)` | Card backgrounds |

### Gold Accent Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--gold-primary` | `#d4a574` | Primary accent, headings, buttons |
| `--gold-bright` | `#e6b873` | Hover states, highlights, bonus values |
| `--gold-muted` | `#c9b397` | Body text, labels |
| `--gold-pale` | `#f5d4a0` | Score values, high-contrast numbers |
| `--gold-dim` | `#8b7355` | Subtle text, metadata, taglines |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#f5ede3` | Primary content |
| `--text-secondary` | `#c9b397` | Secondary content |
| `--text-accent` | `#d4a574` | Interactive text, links |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-solid` | `#3d2f20` | Card borders, button outlines |
| `--border-subtle` | `rgba(212, 165, 116, 0.15)` | Section dividers |
| `--border-faint` | `rgba(212, 165, 116, 0.08)` | Row separators |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#7fb069` | Positive feedback |
| `--color-warning` | `#e6b873` | Warnings (uses gold) |
| `--color-danger` | `#e67373` | Destructive actions |

### Interactive States

| Token | Value | Usage |
|-------|-------|-------|
| `--hover-overlay` | `rgba(212, 165, 116, 0.08)` | Hover backgrounds |
| `--active-overlay` | `rgba(212, 165, 116, 0.12)` | Active/pressed backgrounds |
| `--focus-ring` | `rgba(212, 165, 116, 0.4)` | Focus outlines |

---

## Typography

### Font Families

| Role | Family | Fallback |
|------|--------|----------|
| Display | Playfair Display | Georgia, serif |
| UI | DM Sans | system-ui, sans-serif |

```
Google Fonts import:
https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap
```

### Type Scale

| Name | Size | Weight | Family | Letter Spacing | Usage |
|------|------|--------|--------|----------------|-------|
| `display-xl` | 64px | 900 | Playfair | -2px | App title |
| `display-lg` | 56px | 700 | Playfair | -2px | Total scores |
| `display-md` | 32px | 700 | Playfair | -1px | Category scores |
| `display-sm` | 28px | 700 | Playfair | -1px | Stat values |
| `heading` | 11px | 700 | DM Sans | 2px | Section headers (uppercase) |
| `body` | 15px | 500 | DM Sans | 0 | Labels, UI text |
| `body-sm` | 13px | 500 | DM Sans | 0 | Secondary info |
| `caption` | 11px | 600 | DM Sans | 1px | Metadata (uppercase) |

### Typography Rules

1. **Numbers and scores**: Always use Playfair Display
2. **UI elements**: Always use DM Sans
3. **Section headers**: Uppercase, wide letter-spacing (2-3px)
4. **Large headlines**: Tight letter-spacing (-2px)

---

## Spacing

### Scale

| Token | Value |
|-------|-------|
| `--space-xs` | 6px |
| `--space-sm` | 12px |
| `--space-md` | 16px |
| `--space-lg` | 20px |
| `--space-xl` | 28px |
| `--space-2xl` | 32px |
| `--space-3xl` | 40px |

### Application

| Context | Spacing |
|---------|---------|
| Card padding | 28px |
| Row vertical padding | 16px |
| Between cards | 20px |
| Section margin | 24px |
| Button padding | 16px 28px |
| Grid gap | 12px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--rSm` | 8px | Dice, small elements |
| `--rMd` | 12px | Buttons, stats, inputs |
| `--rLg` | 16px | Large cards |
| `--rXl` | 24px | Modals, hero elements |
| `--rPill` | 999px | Fully rounded badges |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadowSm` | `0 4px 12px rgba(212, 165, 116, 0.25)` | Small elements |
| `--shadowMd` | `0 8px 24px rgba(0, 0, 0, 0.6)` | Elevated cards |
| `--shadowLg` | `0 20px 50px rgba(0, 0, 0, 0.38)` | Dramatic depth |
| `--innerHighlight` | `inset 0 1px 0 rgba(212, 165, 116, 0.1)` | Card top highlight |
| `--shadow-button` | Combined shadow | Primary buttons (outer + inset) |
| `--shadow-button-hover` | Combined shadow | Button hover state |

---

## Motion

### Timing

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Emphasis, decorative |

### Easing

All transitions use `ease` timing function.

### Patterns

| Interaction | Animation |
|-------------|-----------|
| Button hover | translateY(-2px) + shadow increase |
| Button press | translateY(0) |
| Row hover | padding-left shift + border appear |
| Dice hover | rotate(0) + scale(1.1) |

---

## Components

### Card

Elevated container for grouped content.

**Structure**:
- Rounded rectangle (24px radius)
- Gradient background
- 2px solid border
- Single accent line at top (gradient fade)
- Inset highlight for depth

**Anatomy**:
```
┌─────────────────────────────┐
│ ═══════ accent line ═══════ │
│                             │
│  SECTION HEADER             │
│  ─────────────────────      │
│                             │
│  Label              Value   │
│  ························   │
│  Label              Value   │
│                             │
└─────────────────────────────┘
```

### Score Row

Individual scoring category within a card.

**States**:
- Default: Faint bottom border
- Hover: Left gold accent bar (3px)
- Filled: Value displayed in Playfair
- Empty: Em dash (—) placeholder

**Hover behavior**: Padding shifts right, gold bar appears left. No background change.

### Button

**Variants**:

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `--gold-primary` | `--bg-primary` | none |
| Secondary | transparent | `--gold-primary` | `--border-solid` |
| Danger | transparent | `--color-danger` | danger at 30% opacity |

**States**:
- Hover (Primary): Brighten to `--gold-bright`, lift 2px, increase shadow
- Hover (Secondary/Danger): Add overlay background, brighten border
- Active: Return to base position
- Focus: 2px outline with offset

### Stats Grid

Horizontal display of key metrics.

**Layout**: CSS Grid, 3 columns, 12px gap

**Stat item**:
- Subtle background overlay
- Subtle border
- Centered content
- Label above value (uppercase caption)
- Value in display-sm typography

### Dice Display

Decorative element showing dice faces.

**Presentation**:
- Unicode characters: ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
- Low opacity (0.4) by default
- Slight random rotation per die
- Interactive hover: straighten + scale

**Purpose**: Decorative, reinforces game theme without distraction.

### Section Header

Divides content within cards.

**Style**:
- 11px uppercase
- 700 weight
- 2px letter spacing
- Gold color
- Bottom border (subtle)
- 20px bottom margin

### Accent Line

Decorative divider between major sections.

**Style**:
- 2px height
- Gradient: transparent → gold → transparent
- 30% opacity
- 32px vertical margin

---

## Ambient Effects

### Top Glow

Subtle radial gradient at top of viewport simulating ambient tavern lighting.

```css
background: radial-gradient(
    ellipse at top,
    rgba(212, 165, 116, 0.08) 0%,
    transparent 60%
);
```

- Fixed position
- 80% width, 300px height
- Centered horizontally
- Non-interactive (pointer-events: none)

---

## Iconography

### Dice

Use Unicode dice faces, not emoji:
- ⚀ (U+2680)
- ⚁ (U+2681)
- ⚂ (U+2682)
- ⚃ (U+2683)
- ⚄ (U+2684)
- ⚅ (U+2685)

### UI Icons

Keep minimal. When needed:
- Simple line style
- Match text color
- 20-24px size

---

## Content Guidelines

### Voice

- Concise and confident
- Professional but warm
- No unnecessary words

### Button Labels

| Do | Don't |
|----|-------|
| New Game | Roll New Game |
| Finish Game | Complete Game |
| History | View History |
| Export | Export Data |

### Empty States

Use em dash (—) for unfilled scores, not zero or blank.

### Numbers

- No units needed for scores
- Use # prefix for IDs (e.g., #0247)
- Commas for thousands

---

## Accessibility

### Contrast

All text meets WCAG AA minimum contrast ratios against backgrounds.

### Focus

- Visible focus ring on all interactive elements
- 2px outline with 2px offset
- Gold color at 40% opacity

### Touch Targets

Minimum 44×44px for all interactive elements.

### Motion

Respect `prefers-reduced-motion`:
- Disable decorative animations
- Keep functional transitions minimal

---

## Responsive

### Container

- Max width: 600px
- Horizontal padding: 20px (mobile), 32px (tablet), 40px (desktop)
- Vertical padding: 40px (mobile), 48px (tablet), 60px (desktop)

### Breakpoints

| Name | Width | Adjustments |
|------|-------|-------------|
| Mobile | < 600px | Base styles |
| Tablet | ≥ 600px | Larger title (72px), more padding |
| Desktop | ≥ 900px | Largest title (80px), max padding |

### Grid Behavior

Stats grid: 3 columns on mobile, auto-fit on larger screens.

---

## Anti-Patterns

### Don't

- Add multiple borders or frames to cards
- Use textures (wood grain, felt, water stains)
- Add ring overlays or circular watermarks
- Use emoji for dice
- Create busy hover effects with background color changes
- Mix more than two font families
- Use bright/neon accent colors
- Add bounce or spring animations
- Over-decorate with gradients

### Do

- Keep surfaces clean with minimal layering
- Let typography create visual interest
- Use single accent elements (one line, not three)
- Maintain generous whitespace
- Keep animations subtle and purposeful
- Trust the color palette to create warmth

---

## Implementation Reference

All design tokens are defined in `css/variables.css` using CSS custom properties.

Components are organized in `css/components/` directory:
- `buttons.css` - Button variants and states
- `cards.css` - Card layouts and stats
- `scores.css` - Score rows and pickers
- `dice.css` - Dice display and interactions
- `modals.css` - Modal dialogs
- `forms.css` - Form inputs and controls
- `player.css` - Player selection and lists
- `menu.css` - Navigation menus
- `animations.css` - Motion and transitions
- `leaderboard.css` - Statistics and rankings

---

**Last Updated:** 2026-01-19
**Author:** Extracted from production redesign (PR #41)
