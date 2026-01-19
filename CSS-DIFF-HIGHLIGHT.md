# CSS Guidelines vs Implementation: Visual Diff

Quick reference showing what changed between guidelines and actual implementation.

---

## 🎨 Color Variables

### ✅ SAME VALUES, DIFFERENT NAMES

```diff
Original Guidelines          →  Actual Implementation
────────────────────────────────────────────────────────
--bg-elevated                →  --bg-secondary
--bg-elevated-end            →  --bg-tertiary
--gold-dim                   →  --gold-brown
--border-solid               →  --border-primary
--border-faint               →  --border-accent
--overlay-hover              →  --hover-bg
--overlay-active             →  --active-bg
--overlay-subtle             →  --subtle-highlight
--color-success              →  --success
--color-warning              →  --warning
--color-danger               →  --error
```

**Verdict:** ✅ Justifiable - Names more descriptive and concise

---

## 📝 Typography Variables

### 🔄 DIFFERENT NAMING PATTERN

```diff
Original Guidelines          →  Actual Implementation
────────────────────────────────────────────────────────
--text-display-xl: 64px      →  --font-size-h1: 64px
--text-display-lg: 56px      →  --font-size-h2: 48px (DIFFERENT VALUE!)
--text-display-md: 32px      →  --font-size-h3: 32px
--text-display-sm: 28px      →  --font-size-number-md: 28px
--text-display-xs: 24px      →  --font-size-number-sm: 24px
--text-body: 15px            →  --font-size-body: 15px
--text-body-sm: 13px         →  --font-size-small: 13px
--text-caption: 11px         →  --font-size-tiny: 11px

--weight-regular: 400        →  --font-weight-regular: 400
--weight-medium: 500         →  --font-weight-medium: 500
--weight-bold: 700           →  --font-weight-bold: 700
--weight-black: 900          →  --font-weight-black: 900

--tracking-tight: -2px       →  --letter-spacing-tight: -2px
--tracking-snug: -1px        →  --letter-spacing-normal: -1px
--tracking-normal: 0         →  ❌ MISSING
--tracking-wide: 1px         →  ❌ MISSING
--tracking-wider: 2px        →  --letter-spacing-wide: 2px
--tracking-widest: 3px       →  --letter-spacing-wider: 3px
```

**Verdict:** 🔄 More explicit naming, added score-specific sizes

---

### ⚠️ MISSING FONT FALLBACKS

```diff
Original Guidelines                              Actual Implementation
────────────────────────────────────────────────────────────────────────
'Playfair Display', Georgia, serif         →  'Playfair Display', serif (missing Georgia)
'DM Sans', system-ui, sans-serif           →  'DM Sans', sans-serif (missing system-ui)
```

**Verdict:** ⚠️ Should add fallbacks

---

## 📏 Spacing

### ⚠️ SIGNIFICANT VALUE CHANGES

```diff
Original Guidelines     Actual Implementation     Change
─────────────────────────────────────────────────────────
--space-xs: 6px      →  --space-xs: 6px          ✅ Same
--space-sm: 12px     →  --space-sm: 12px         ✅ Same
--space-md: 16px     →  --space-md: 20px         ⚠️ +25% (4px larger)
--space-lg: 20px     →  --space-lg: 28px         ⚠️ +40% (8px larger)
--space-xl: 28px     →  --space-xl: 40px         ⚠️ +43% (12px larger)
--space-2xl: 32px    →  ❌ MISSING
--space-3xl: 40px    →  ❌ MISSING
```

**Verdict:** ⚠️ **Intentional deviation** - Better for touch interfaces

---

## ⭕ Border Radius

### 🔄 ABBREVIATED NAMES + ADDITIONAL SIZES

```diff
Original Guidelines       Actual Implementation
────────────────────────────────────────────────
--radius-sm: 8px       →  --rSm: 8px
--radius-md: 12px      →  --rMd: 12px
--radius-lg: 24px      →  --rLg: 16px (DIFFERENT VALUE!)
                          --rXl: 24px (NEW - matches original --radius-lg)
                          --rPill: 999px (NEW - fully rounded)
```

**Verdict:** ✅ Improved - More granular control

---

## 🌑 Shadows

### 🔄 ABBREVIATED NAMES + COMBINED SHADOWS

```diff
Original Guidelines                          Actual Implementation
──────────────────────────────────────────────────────────────────────────
--shadow-card: 0 8px 24px rgba(...)       →  --shadowMd: 0 8px 24px rgba(...)

--shadow-button: 0 4px 12px rgba(...)     →  --shadowSm: 0 4px 12px rgba(...)
--shadow-inset-button: inset 0 1px 0...   →  Combined into --shadow-button

--shadow-button-hover: 0 6px 20px...      →  --shadow-button-hover: (combined)

--shadow-inset-card: inset 0 1px 0...     →  --innerHighlight: inset 0 1px 0...

--shadow-focus: 0 0 0 3px rgba(...)       →  ❌ MISSING (uses outline instead)
```

**Combined shadow example:**
```css
/* Original (apply separately) */
box-shadow: var(--shadow-button), var(--shadow-inset-button);

/* Actual (single variable) */
--shadow-button: 0 4px 12px rgba(...), inset 0 1px 0 rgba(...);
box-shadow: var(--shadow-button);
```

**Verdict:** ✅ Practical - Reduces CSS repetition

---

## ⏱️ Motion

### ✅ COMBINED DURATION + EASING

```diff
Original Guidelines                      Actual Implementation
─────────────────────────────────────────────────────────────────
--duration-fast: 150ms                →  --transition-fast: 0.15s ease
--duration-normal: 200ms              →  --transition-normal: 0.2s ease
--duration-slow: 300ms                →  --transition-slow: 0.3s ease
--easing: ease                        →  (combined into above)

Usage:
transition: all var(--duration-normal) var(--easing);  →  transition: all var(--transition-normal);
```

**Verdict:** ✅ Improvement - More concise

---

## 📊 Z-Index

### ❌ COMPLETELY MISSING

```diff
Original Guidelines       Actual Implementation
──────────────────────────────────────────────────
--z-base: 0            →  ❌ Hardcoded: 0
--z-elevated: 1        →  ❌ Hardcoded: 1
--z-overlay: 10        →  ❌ Hardcoded: 10, 20 (inconsistent)
--z-modal: 100         →  ❌ Hardcoded: 50, 100 (inconsistent)
--z-toast: 1000        →  ❌ Hardcoded: 998, 999, 1000, 9999 (very inconsistent)
```

**Hardcoded z-index values found:**
- `0` - base.css (ambient glow)
- `1` - base.css (container)
- `10` - base.css (sticky tabs), forms.css
- `20` - base.css (sticky), player.css
- `50` - modals.css (modal backdrop)
- `100` - animations.css, cards.css (game header)
- `998, 999, 1000` - menu.css (side menu)
- `9999` - animations.css (toast, fireworks)

**Verdict:** ❌ **CRITICAL ISSUE** - No system, inconsistent, hard to maintain

---

## 🧩 Component Classes

### 🔄 NO BEM NAMING (Single Dash vs Double Dash)

```diff
Original Guidelines (BEM)       Actual Implementation
───────────────────────────────────────────────────────
.header                      →  ❌ Not used
.header__title               →  Different pattern (no BEM)
.header__tagline             →  Different pattern (no BEM)

.card                        →  ✅ .card
.card::before                →  ✅ .card::before

.section-header              →  🔄 .section-title

.btn--primary                →  🔄 .btn-primary (single dash)
.btn--secondary              →  🔄 .btn-secondary (single dash)
.btn--danger                 →  🔄 .btn-danger (single dash)

.info-card                   →  🔄 .session-info
.info-card__label            →  🔄 .session-label
.info-card__value            →  🔄 .session-value
```

**Verdict:** 🔄 Simpler naming - BEM not strictly followed but functionally equivalent

---

## 🛠️ Utility Classes

### ❌ DESIGN TOKENS REPLACED WITH TAILWIND STYLE

**Original Guidelines (design token based):**
```css
.text-xs { font-size: var(--text-caption); }
.text-sm { font-size: var(--text-body-sm); }
.text-base { font-size: var(--text-body); }
.text-lg { font-size: var(--text-display-xs); }
.text-xl { font-size: var(--text-display-sm); }

.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
```

**Actual Implementation (Tailwind rem-based):**
```css
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }

.mt-4 { margin-top: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
```

**Verdict:** ❌ **Inconsistent with design system** - Doesn't use design tokens

---

### ✅ BUT ADDED ESSENTIAL UTILITIES

**Not in guidelines but implemented:**
```css
/* Flexbox */
.flex, .flex-col, .items-center, .justify-between, .gap-2

/* Grid */
.grid, .grid-cols-2, .grid-cols-3

/* Layout */
.w-full, .overflow-x-auto, .whitespace-nowrap

/* Border Radius (uses tokens!) */
.rounded-sm { border-radius: var(--rSm); }
.rounded-md { border-radius: var(--rMd); }
.rounded-lg { border-radius: var(--rLg); }
```

**Verdict:** ✅ Essential modern utilities

---

## ♿ Accessibility

### ❌ ALL THREE FEATURES MISSING

#### 1. Reduced Motion - NOT IMPLEMENTED

```css
/* Original Guideline */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Actual Implementation */
❌ NOT PRESENT
```

**Impact:** Users with vestibular disorders cannot disable animations

---

#### 2. Focus-Visible - NOT IMPLEMENTED

```css
/* Original Guideline */
.btn:focus:not(:focus-visible) {
  outline: none;
}

.btn:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}

/* Actual Implementation */
.btn-primary:focus {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}
/* But no :focus-visible distinction */
```

**Impact:** Focus outline shows on mouse clicks (annoying UX)

---

#### 3. High Contrast Mode - NOT IMPLEMENTED

```css
/* Original Guideline */
@media (prefers-contrast: high) {
  :root {
    --border-faint: rgba(212, 165, 116, 0.3);
    --border-subtle: rgba(212, 165, 116, 0.4);
  }
}

/* Actual Implementation */
❌ NOT PRESENT
```

**Impact:** Users with low vision don't get enhanced contrast

---

## 📊 Summary Dashboard

### Implementation Quality by Category

| Category | Status | Score | Notes |
|----------|--------|-------|-------|
| **Colors** | ✅ Excellent | 95% | All present, better naming |
| **Typography** | 🔄 Good | 85% | Different naming, missing fallbacks |
| **Spacing** | ⚠️ Acceptable | 70% | Intentional value changes |
| **Border Radius** | ✅ Excellent | 95% | Improved with granularity |
| **Shadows** | ✅ Excellent | 90% | Combined shadows practical |
| **Motion** | ✅ Excellent | 100% | Improved implementation |
| **Z-Index** | ❌ Critical | 0% | Not implemented at all |
| **Components** | 🔄 Good | 85% | Works but no BEM |
| **Utilities** | ⚠️ Inconsistent | 60% | Tailwind instead of tokens |
| **Accessibility** | ❌ Critical | 0% | All 3 features missing |

**Overall Score:** 68% (Usable but needs critical fixes)

---

## 🎯 Quick Wins vs Critical Issues

### 🟢 Quick Wins (Works Well, Minor Tweaks)

1. ✅ Color system - Rename for consistency
2. ✅ Typography - Add font fallbacks
3. ✅ Border radius - Document the improvements
4. ✅ Shadows - Document the combined approach
5. ✅ Motion - Already excellent

### 🔴 Critical Issues (Must Fix)

6. ❌ **Z-index system** - Create variables, refactor all files
7. ❌ **Reduced motion** - Add media query (WCAG violation)
8. ❌ **Focus-visible** - Implement keyboard-only focus
9. ❌ **High contrast** - Add media query (accessibility)
10. ⚠️ **Utility classes** - Consider using design tokens

---

## 📝 Implementation Priority

### Phase 1: Critical Fixes (1-2 hours)

```bash
# 1. Add z-index variables to variables.css
# 2. Refactor hardcoded z-index in 7 files
# 3. Add @media (prefers-reduced-motion)
# 4. Add :focus-visible to buttons, inputs, dice
# 5. Add @media (prefers-contrast: high)
# 6. Add font fallbacks
```

### Phase 2: Consistency Improvements (2-3 hours)

```bash
# 7. Document spacing value changes as intentional
# 8. Update CSS.md with actual naming conventions
# 9. Consider design token utilities vs Tailwind
```

### Phase 3: Nice-to-Have (Optional)

```bash
# 10. Add missing tracking values
# 11. Evaluate BEM adoption for team consistency
```

---

## 🔧 Copy-Paste Fix: Add to variables.css

```css
/* ========================================
   Z-INDEX SCALE (ADD THIS)
   ======================================== */
--z-base: 0;
--z-elevated: 1;
--z-overlay: 10;
--z-sticky: 20;
--z-modal-backdrop: 50;
--z-modal: 100;
--z-menu: 1000;
--z-toast: 9999;

/* ========================================
   FONT FALLBACKS (FIX THIS)
   ======================================== */
--font-display: 'Playfair Display', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;

/* ========================================
   MISSING TRACKING VALUES (ADD THIS)
   ======================================== */
--letter-spacing-none: 0;
--letter-spacing-normal: 0.5px;
```

---

## 🔧 Copy-Paste Fix: Add to base.css

```css
/* ========================================
   ACCESSIBILITY - REDUCED MOTION
   ======================================== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ========================================
   ACCESSIBILITY - HIGH CONTRAST
   ======================================== */
@media (prefers-contrast: high) {
  :root {
    --border-accent: rgba(212, 165, 116, 0.3);
    --border-subtle: rgba(212, 165, 116, 0.4);
  }
}
```

---

## 🔧 Copy-Paste Fix: Add to buttons.css, forms.css, dice.css

```css
/* ========================================
   ACCESSIBILITY - FOCUS-VISIBLE
   ======================================== */

/* Hide focus for mouse users */
.btn:focus:not(:focus-visible),
.input:focus:not(:focus-visible),
.die:focus:not(:focus-visible) {
  outline: none;
}

/* Show focus only for keyboard users */
.btn:focus-visible,
.input:focus-visible,
.die:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}
```

---

**Last Updated:** 2026-01-19
**Quick reference for:** Understanding CSS guideline compliance
