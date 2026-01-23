# Schnitzel PWA Refactoring Plan

## Overview

This document outlines the refactoring of the Schnitzel Yahtzee PWA from a single 2900+ line `index.html` file into a modular, maintainable architecture.

## Goals

1. **Separation of Concerns**: Split CSS, JavaScript business logic, and UI rendering
2. **Reusable Components**: Create modular UI components that can be reused across views
3. **Maintainability**: Easier to understand, modify, and extend
4. **Same Functionality**: All existing features must continue to work identically
5. **Same Design**: Visual appearance must remain unchanged

## New Project Structure

```
/home/user/Kniffel-scoring/
├── index.html              # Entry point (minimal HTML + script imports)
├── sw.js                   # Service worker (updated cache list)
├── manifest.json           # PWA manifest (unchanged)
├── version.json            # Version info (unchanged)
│
├── css/
│   ├── main.css            # Entry point - imports all CSS
│   ├── variables.css       # CSS custom properties (colors, spacing, shadows)
│   ├── base.css            # Reset, body, container styles
│   ├── utilities.css       # Utility classes (flex, grid, text-*, etc.)
│   └── components/
│       ├── buttons.css     # All button variants
│       ├── cards.css       # Card styles
│       ├── modals.css      # Modal overlay and container
│       ├── forms.css       # Input, checkbox styles
│       ├── player.css      # Player carousel, player cards, tabs
│       ├── dice.css        # Dice area, die styling
│       ├── scores.css      # Score buttons, sections, standings
│       ├── menu.css        # Hamburger button, side menu
│       └── animations.css  # Keyframes and animation classes
│
├── js/
│   ├── app.js              # Main entry point - initializes app
│   ├── state.js            # Global state object (S) and state management
│   ├── constants.js        # UPPER, LOWER, COLORS constants
│   ├── router.js           # Navigation, history API handling
│   │
│   ├── utils/
│   │   ├── scoring.js      # Score calculations (upTot, loTot, grand, etc.)
│   │   ├── storage.js      # localStorage operations (save, load, clear)
│   │   └── helpers.js      # General helpers (color, empty, isGameComplete)
│   │
│   ├── services/
│   │   ├── dice.js         # Dice rolling, shake detection, score calculation
│   │   ├── export.js       # Export/import data functions
│   │   ├── fireworks.js    # Fireworks canvas animation
│   │   ├── toast.js        # Toast notification system
│   │   └── pwa.js          # Service worker registration, update handling
│   │
│   └── views/
│       ├── setup.js        # Setup/home screen view
│       ├── game.js         # Main game view
│       ├── history.js      # History list + detail views
│       ├── endScreen.js    # End game celebration view
│       └── components/
│           ├── modal.js        # Modal wrapper component
│           ├── playerCard.js   # Player card component
│           ├── scoreRow.js     # Score row component
│           ├── diceArea.js     # Dice area with controls
│           ├── sideMenu.js     # Side menu component
│           └── picker.js       # Score picker modal
│
└── docs/
    └── REFACTORING.md      # This document
```

## Architecture Patterns

### 1. State Management

Single global state object `S` with clear mutation functions:

```javascript
// state.js
export const S = {
  view: 'setup',
  known: [],      // Known players
  game: [],       // Current game players
  cur: 0,         // Current player index
  // ... etc
};

export function updateState(key, value) { ... }
```

### 2. Component Pattern

Components are functions that return HTML strings:

```javascript
// components/playerCard.js
export function playerCard(player, isActive, color) {
  if (isActive) {
    return `<div class="player-card player-card-active" style="...">...</div>`;
  }
  return `<div class="player-card player-card-inactive">...</div>`;
}
```

### 3. View Pattern

Views compose components and return full page HTML:

```javascript
// views/game.js
import { playerCard } from './components/playerCard.js';
import { diceArea } from './components/diceArea.js';

export function gameView() {
  const cards = S.game.map(p => playerCard(p, ...)).join('');
  return `<div>...${cards}...${diceArea()}...</div>`;
}
```

### 4. Service Pattern

Services encapsulate business logic:

```javascript
// services/dice.js
export function rollDice() { ... }
export function calcScore(dice, category) { ... }
export function setupShakeDetection() { ... }
```

## Module Loading Strategy

Using ES modules with `<script type="module">`:

```html
<!-- index.html -->
<script type="module" src="js/app.js"></script>
```

The app.js file imports everything needed and exposes global functions for onclick handlers.

## CSS Architecture

Using CSS imports for modularity:

```css
/* main.css */
@import 'variables.css';
@import 'base.css';
@import 'utilities.css';
@import 'components/buttons.css';
/* ... */
```

## Migration Notes

### Preserved Exactly
- All CSS custom properties and values
- All class names and styles
- All HTML structure generated by views
- All onclick handlers and functionality
- Service worker behavior
- localStorage keys and data format

### Changes
- Code organization only
- No visual changes
- No functionality changes

## Testing Checklist

After refactoring, verify:

- [ ] Setup screen loads correctly
- [ ] Player selection works
- [ ] Game modes (score/play) both work
- [ ] Dice rolling and shake detection work
- [ ] Score entry (both modes) works
- [ ] Player switching works
- [ ] Game completion detection works
- [ ] End screen animations work
- [ ] History view works
- [ ] History detail view works
- [ ] Side menu opens/closes
- [ ] Export/import data works
- [ ] PWA update detection works
- [ ] Service worker caches all files
- [ ] Offline functionality works
