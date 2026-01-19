# Component Architecture & Modularity Guidelines

**Version:** 1.0
**Purpose:** Define reusable component patterns for the Kniffel PWA

---

## Philosophy

The Kniffel app uses **atomic component design** with functional JavaScript to create:

1. **Reusable building blocks** - Small, composable functions
2. **Separation of concerns** - Structure, style, and behavior are separate
3. **Zero inline styles** - All styling through CSS classes
4. **Consistent patterns** - Same component, same implementation

---

## Architecture Layers

```
┌─────────────────────────────────────┐
│  Views (setup.js, game.js, etc.)   │  ← Compose components
├─────────────────────────────────────┤
│  Components (buttons, cards, etc.)  │  ← Atomic building blocks
├─────────────────────────────────────┤
│  CSS (variables, utilities, etc.)   │  ← Styling only
├─────────────────────────────────────┤
│  State & Logic (state.js, utils)    │  ← Data & business logic
└─────────────────────────────────────┘
```

---

## Core Principles

### 1. **No Inline Styles**

❌ **DON'T:**
```javascript
return `<div style="margin-bottom:var(--space-md);color:var(--text)">...</div>`;
```

✅ **DO:**
```javascript
return `<div class="mb-md text-primary">...</div>`;
```

**Rationale:**
- Inline styles can't be reused
- Not cacheable by browser
- Hard to maintain consistency
- Violates separation of concerns

### 2. **Atomic Components**

Components should be **small, focused, and composable**.

❌ **DON'T:** Create specialized variants for every use case
```javascript
function upperScoreRow() { /* 30 lines */ }
function lowerScoreRow() { /* 30 lines */ }
function upperScoreRowPlay() { /* 30 lines */ }
function lowerScoreRowPlay() { /* 30 lines */ }
```

✅ **DO:** Create one flexible component
```javascript
function ScoreRow({ label, hint, value, variant, onClear, onSelect }) {
  // 15 lines, handles all cases
}
```

### 3. **Props/Options Pattern**

Components accept a single options object for configuration.

✅ **GOOD:**
```javascript
function Button({ text, icon, variant = 'primary', disabled = false, onClick }) {
  const classes = `btn btn-${variant} ${disabled ? 'disabled' : ''}`.trim();
  const iconHtml = icon ? `<span class="btn-icon">${icon}</span>` : '';

  return `
    <button class="${classes}"
            onclick="${onClick}"
            ${disabled ? 'disabled' : ''}>
      ${iconHtml}
      <span>${text}</span>
    </button>
  `;
}
```

### 4. **CSS Class Composition**

Build class strings from CSS utility classes, never style attributes.

✅ **GOOD:**
```javascript
function Card({ title, children, className = '' }) {
  return `
    <div class="card ${className}">
      ${title ? `<h3 class="card-title">${title}</h3>` : ''}
      <div class="card-content">${children}</div>
    </div>
  `;
}
```

### 5. **Behavior via Event Delegation**

Prefer event delegation over inline onclick handlers where possible.

⚠️ **ACCEPTABLE (for now):**
```javascript
<button onclick="handleClick()">Click</button>
```

✅ **BETTER (when refactoring):**
```javascript
// In app.js or view setup
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-action="submit"]')) {
    handleSubmit(e);
  }
});

// In component
<button data-action="submit">Submit</button>
```

---

## Component Catalog

### **Button Component**

**Location:** `js/components/ui.js`

**Variants:**
- `primary` - Main call-to-action (gold background)
- `secondary` - Secondary action (transparent with border)
- `danger` - Destructive action (red)
- `text` - Minimal text-only button
- `icon` - Icon-only button

**Props:**
```javascript
{
  text: string,        // Button text
  icon: string,        // Optional emoji/icon
  variant: string,     // 'primary' | 'secondary' | 'danger' | 'text' | 'icon'
  size: string,        // 'sm' | 'md' | 'lg'
  disabled: boolean,   // Disabled state
  onClick: string,     // Click handler name
  className: string    // Additional classes
}
```

**Usage:**
```javascript
import { Button } from './components/ui.js';

Button({ text: 'Start Game', variant: 'primary', onClick: 'startGame()' })
Button({ icon: '⚙️', variant: 'icon', onClick: 'openSettings()' })
```

---

### **Card Component**

**Location:** `js/components/ui.js`

**Props:**
```javascript
{
  title: string,       // Optional card title
  children: string,    // HTML content
  className: string,   // Additional classes
  noPadding: boolean   // Remove default padding
}
```

**Usage:**
```javascript
import { Card } from './components/ui.js';

Card({
  title: 'Players',
  children: playerList(),
  className: 'mb-lg'
})
```

---

### **Section Component**

**Location:** `js/components/ui.js`

**Purpose:** Section headers with optional progress indicators

**Props:**
```javascript
{
  title: string,        // Section title (auto-uppercased)
  subtitle: string,     // Optional subtitle
  progress: object,     // { current: number, total: number }
  className: string
}
```

**Usage:**
```javascript
import { Section } from './components/ui.js';

Section({
  title: 'Upper Section',
  progress: { current: 3, total: 6 }
})
```

---

### **ScoreRow Component**

**Location:** `js/components/scoreComponents.js`

**Purpose:** Unified score row for all modes and sections

**Props:**
```javascript
{
  label: string,         // Category name
  hint: string,          // Hint text (e.g., possible values)
  value: number | null,  // Current score value
  state: string,         // 'empty' | 'filled' | 'available' | 'zero-only'
  variant: string,       // 'upper' | 'lower' | 'bonus' | 'total'
  showClear: boolean,    // Show clear button
  speedBonus: object,    // { amount: number, text: string }
  onClear: string,       // Clear handler
  onSelect: string       // Select handler
}
```

**Usage:**
```javascript
import { ScoreRow } from './components/scoreComponents.js';

ScoreRow({
  label: 'Ones',
  hint: '(0,1,2,3,4,5)',
  value: scores.ones,
  state: scores.ones !== null ? 'filled' : 'empty',
  variant: 'upper',
  onClear: `clr('ones')`,
  onSelect: `pick('ones')`
})
```

---

### **PageHeader Component**

**Location:** `js/components/ui.js`

**Purpose:** Unified page headers with proper visual hierarchy

**Design Philosophy:**
- **Not all pages are hero pages** - Only home page gets large treatment
- **Navigation pages** - Clean, compact headers (24px title)
- **Working pages** - Minimal headers for maximum content space (20px title)
- **Industry standard** - Follows iOS (44px) and Material Design (56px) app bar patterns

**Header Hierarchy:**

| Page Type | Title Size | Total Height | Purpose |
|-----------|-----------|--------------|---------|
| **Hero (Setup)** | 64px | ~200px | Welcome, make impression |
| **Navigation** | 24px | ~60px | Utility, content-focused |
| **Working (Game)** | 20px | ~48px | Minimal, sticky header |

**Props:**
```javascript
{
  title: string,           // Page title (default: 'SCHNITZEL')
  subtitle: string,        // Optional subtitle/tagline
  showLogo: boolean,       // Show logo (hero page only)
  backButton: string,      // Back button onclick handler
  rightButton: object,     // { text, onClick, variant, size }
  className: string
}
```

**Usage:**

```javascript
import { PageHeader } from './components/ui.js';

// Hero page (Setup)
PageHeader({
  title: 'SCHNITZEL',
  subtitle: 'Your Travel Yahtzee Companion',
  showLogo: true
})

// Navigation page (History, Leaderboard)
PageHeader({
  title: '📜 History',
  backButton: 'navigateTo(\'setup\')'
})

// Working page (Game) - uses custom .game-header styles
// See game.js for implementation
```

**Design Rationale:**

1. **Premium Simplicity** - Restraint over decoration
2. **Content First** - Headers don't compete with main content
3. **Mobile Standards** - Follows iOS/Material Design patterns
4. **Consistency** - All navigation pages have same structure

**Anti-Patterns:**

❌ **DON'T:** Use large display fonts (56px+) for navigation headers
❌ **DON'T:** Make sticky headers bulky (wastes screen space)
❌ **DON'T:** Treat every page like a landing page

✅ **DO:** Keep utility pages clean and compact
✅ **DO:** Reserve hero treatment for home/welcome screens
✅ **DO:** Minimize sticky header height

---

### **Badge Component**

**Location:** `js/components/ui.js`

**Purpose:** Mode badges, status indicators

**Props:**
```javascript
{
  text: string,         // Badge text
  icon: string,         // Optional icon
  variant: string,      // 'play' | 'score' | 'blitz' | 'unknown'
  className: string
}
```

**Usage:**
```javascript
import { Badge } from './components/ui.js';

Badge({ icon: '🎲', text: 'Play Mode', variant: 'play' })
```

---

## CSS Conventions

### **Utility Classes Required**

All common patterns must have utility classes in `css/utilities.css`:

```css
/* Layout */
.container-fullheight { min-height: 100vh; }
.mb-xs { margin-bottom: var(--space-xs); }
.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
.mb-xl { margin-bottom: var(--space-xl); }

/* Typography */
.text-center { text-align: center; }
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.font-display { font-family: var(--font-display); }
.font-body { font-family: var(--font-body); }

/* Spacing */
.p-sm { padding: var(--space-sm); }
.p-md { padding: var(--space-md); }
.p-lg { padding: var(--space-lg); }
```

### **Component-Specific Classes**

Component variations go in component CSS files:

```css
/* css/components/buttons.css */
.btn { /* base button styles */ }
.btn-primary { /* variant */ }
.btn-secondary { /* variant */ }
.btn-sm { /* size */ }
.btn-lg { /* size */ }
```

---

## File Organization

```
js/
├── components/
│   ├── ui.js                    ← Button, Card, Section, Badge
│   ├── scoreComponents.js       ← ScoreRow, ScoreGrid
│   └── layoutComponents.js      ← Modal, Menu, Toast
├── views/
│   ├── setup.js                 ← Uses components
│   ├── game.js                  ← Uses components
│   └── ...
├── utils/
│   ├── helpers.js
│   └── ...
└── state.js
```

---

## Migration Checklist

When refactoring existing code:

- [ ] Replace inline styles with CSS classes
- [ ] Extract duplicated HTML into components
- [ ] Use component functions instead of template strings
- [ ] Move event handlers to proper functions
- [ ] Add missing utility classes to CSS
- [ ] Update imports to use component functions
- [ ] Test all functionality
- [ ] Remove dead code

---

## Anti-Patterns

### ❌ **DON'T: Inline Everything**

```javascript
return `
  <button style="padding:1rem;background:var(--gold-primary);border-radius:var(--rSm)"
          onclick="doThing()">
    <span style="font-weight:700;color:var(--onAccent)">Click Me</span>
  </button>
`;
```

### ❌ **DON'T: Duplicate Structure**

```javascript
function scoreRowVariant1() { return `<div class="row">...</div>`; }
function scoreRowVariant2() { return `<div class="row">...</div>`; }
function scoreRowVariant3() { return `<div class="row">...</div>`; }
```

### ❌ **DON'T: Mix Concerns**

```javascript
function setupView() {
  // 500 lines mixing:
  // - Data fetching
  // - Business logic
  // - HTML generation
  // - Styling
  // - Event handling
}
```

---

## Best Practices

### ✅ **DO: Compose Small Pieces**

```javascript
function PlayerList({ players }) {
  return `
    <div class="player-list">
      ${players.map(p => PlayerRow(p)).join('')}
    </div>
  `;
}

function PlayerRow({ name, color, isSelected, onToggle }) {
  return `
    <div class="player-row ${isSelected ? 'selected' : ''}">
      <div class="color-dot" style="background:${color}"></div>
      <span class="player-name">${escapeHtml(name)}</span>
      ${Button({ icon: isSelected ? '✓' : '', variant: 'icon', onClick: onToggle })}
    </div>
  `;
}
```

### ✅ **DO: Separate Concerns**

```javascript
// Data/Logic - state.js
function getActivePlayers() { /* ... */ }

// Component - ui.js
function PlayerCard({ player }) { /* ... */ }

// View - setup.js
function setupView() {
  const players = getActivePlayers();
  return `<div class="container">${players.map(PlayerCard).join('')}</div>`;
}

// Styles - player.css
.player-row { /* ... */ }
```

### ✅ **DO: Use Defaults**

```javascript
function Button({
  text = '',
  icon = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick = '',
  className = ''
}) {
  // Clear defaults, easy to use
}
```

---

## Testing Components

When adding new components:

1. **Test all variants**
   ```javascript
   Button({ variant: 'primary' })
   Button({ variant: 'secondary' })
   Button({ variant: 'danger' })
   ```

2. **Test edge cases**
   ```javascript
   Button({ text: '' })  // No text
   Button({ disabled: true })  // Disabled state
   Button({ icon: '⚙️', text: 'Settings' })  // With icon
   ```

3. **Test composition**
   ```javascript
   Card({
     title: 'Test',
     children: Button({ text: 'Click' })
   })
   ```

---

## Refactoring Priority

When refactoring to components:

1. **High Impact, Low Risk**
   - Create utility CSS classes
   - Create Button component
   - Create Card component

2. **High Impact, Medium Risk**
   - Unify ScoreRow variants
   - Create Section component
   - Remove inline styles from setup.js

3. **Medium Impact, Medium Risk**
   - Refactor game.js view
   - Refactor history.js view
   - Create layout components

4. **Low Impact, High Risk**
   - Event delegation refactoring
   - State management improvements

---

## Version History

- **1.0** (2026-01-19) - Initial component architecture guidelines

---

## See Also

- [DESIGN.md](DESIGN.md) - Design system tokens and visual guidelines
- [CSS.md](CSS.md) - CSS architecture and technical implementation
- [UX.md](UX.md) - User experience patterns and interactions
- [CLAUDE.md](CLAUDE.md) - Main documentation hub
