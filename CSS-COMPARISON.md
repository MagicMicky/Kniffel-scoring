# CSS Guidelines vs Implementation Comparison

Complete analysis of what was implemented, what differs, and what's missing.

---

## 1. CSS Custom Properties

### ✅ Colors - IMPLEMENTED (with naming differences)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `--bg-primary: #1a1512` | `--bg-primary: #1a1512` | ✅ Same | |
| `--bg-elevated: #2a2018` | `--bg-secondary: #2a2018` | 🔄 Different name | More descriptive name |
| `--bg-elevated-end: #1f1810` | `--bg-tertiary: #1f1810` | 🔄 Different name | Clearer hierarchy |
| `--gold-primary: #d4a574` | `--gold-primary: #d4a574` | ✅ Same | |
| `--gold-bright: #e6b873` | `--gold-bright: #e6b873` | ✅ Same | |
| `--gold-muted: #c9b397` | `--gold-muted: #c9b397` | ✅ Same | |
| `--gold-pale: #f5d4a0` | `--gold-pale: #f5d4a0` | ✅ Same | |
| `--gold-dim: #8b7355` | `--gold-brown: #8b7355` | 🔄 Different name | More descriptive |
| `--text-primary: #f5ede3` | `--text-primary: #f5ede3` | ✅ Same | |
| `--text-secondary: #c9b397` | `--text-secondary: #c9b397` | ✅ Same | |
| `--text-accent: #d4a574` | `--text-accent: #d4a574` | ✅ Same | |
| `--border-solid: #3d2f20` | `--border-primary: #3d2f20` | 🔄 Different name | Matches naming pattern |
| `--border-subtle: rgba(...)` | `--border-subtle: rgba(...)` | ✅ Same | |
| `--border-faint: rgba(...)` | `--border-accent: rgba(...)` | 🔄 Different name | Clearer purpose |
| `--color-success: #7fb069` | `--success: #7fb069` | 🔄 Different name | Shorter, cleaner |
| `--color-warning: #e6b873` | `--warning: #e6b873` | 🔄 Different name | Shorter, cleaner |
| `--color-danger: #e67373` | `--error: #e67373` | 🔄 Different name | More common term |
| `--overlay-hover: rgba(...)` | `--hover-bg: rgba(...)` | 🔄 Different name | Shorter, clearer |
| `--overlay-active: rgba(...)` | `--active-bg: rgba(...)` | 🔄 Different name | Shorter, clearer |
| `--overlay-subtle: rgba(...)` | `--subtle-highlight: rgba(...)` | 🔄 Different name | More descriptive |

**Additional variables (not in guidelines):**
- `--focusRing`, `--focusRingStrong` - Added for actual focus state implementation
- `--ambient-glow`, `--card-bg-overlay`, `--stat-bg-overlay` - Added for specific component needs
- Legacy aliases: `--accent`, `--onAccent`, `--surface`, etc. - Backward compatibility

**Verdict:** ✅ **Justifiable implementation** - All colors present, naming improvements make code more readable.

---

### 🔄 Typography - IMPLEMENTED (different naming convention)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `--font-display: 'Playfair Display', Georgia, serif` | `--font-display: 'Playfair Display', serif` | ⚠️ Missing fallback | Should add Georgia |
| `--font-body: 'DM Sans', system-ui, sans-serif` | `--font-body: 'DM Sans', sans-serif` | ⚠️ Missing fallback | Should add system-ui |
| `--text-display-xl: 64px` | `--font-size-h1: 64px` | 🔄 Different name | Different pattern |
| `--text-display-lg: 56px` | `--font-size-h2: 48px` | 🔄 Different value | Different usage |
| `--text-display-md: 32px` | `--font-size-h3: 32px` | 🔄 Different name | Different pattern |
| `--text-display-sm: 28px` | `--font-size-number-md: 28px` | 🔄 Different name | Score-specific |
| `--text-display-xs: 24px` | `--font-size-number-sm: 24px` | 🔄 Different name | Score-specific |
| `--text-body: 15px` | `--font-size-body: 15px` | 🔄 Different name | More explicit |
| `--text-body-sm: 13px` | `--font-size-small: 13px` | 🔄 Different name | More explicit |
| `--text-caption: 11px` | `--font-size-tiny: 11px` | 🔄 Different name | More explicit |
| `--weight-regular: 400` | `--font-weight-regular: 400` | 🔄 Different name | More explicit |
| `--weight-medium: 500` | `--font-weight-medium: 500` | 🔄 Different name | More explicit |
| `--weight-bold: 700` | `--font-weight-bold: 700` | 🔄 Different name | More explicit |
| `--weight-black: 900` | `--font-weight-black: 900` | 🔄 Different name | More explicit |
| `--tracking-tight: -2px` | `--letter-spacing-tight: -2px` | 🔄 Different name | More explicit |
| `--tracking-snug: -1px` | `--letter-spacing-normal: -1px` | 🔄 Different name | More explicit |
| `--tracking-normal: 0` | ❌ Not implemented | ❌ Missing | |
| `--tracking-wide: 1px` | ❌ Not implemented | ❌ Missing | |
| `--tracking-wider: 2px` | `--letter-spacing-wide: 2px` | 🔄 Different name | More explicit |
| `--tracking-widest: 3px` | `--letter-spacing-wider: 3px` | 🔄 Different name | More explicit |

**Additional variables (not in guidelines):**
- `--font-size-number-xl: 56px` - Added for large score displays
- `--font-size-number-lg: 32px` - Added for category scores
- `--font-size-number-md: 28px` - Added for stat values
- `--font-size-number-sm: 24px` - Added for smaller scores

**Verdict:** 🔄 **Justifiable with concerns**
- ✅ More explicit naming (`--font-weight-*` vs `--weight-*`) improves clarity
- ✅ Score-specific sizes (`--font-size-number-*`) address real UI needs
- ⚠️ Missing font fallbacks should be added for better font loading
- ⚠️ Some tracking values missing but rarely used

---

### ⚠️ Spacing - IMPLEMENTED (significant value changes)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `--space-xs: 6px` | `--space-xs: 6px` | ✅ Same | |
| `--space-sm: 12px` | `--space-sm: 12px` | ✅ Same | |
| `--space-md: 16px` | `--space-md: 20px` | ⚠️ **Changed value** | Increased by 25% |
| `--space-lg: 20px` | `--space-lg: 28px` | ⚠️ **Changed value** | Increased by 40% |
| `--space-xl: 28px` | `--space-xl: 40px` | ⚠️ **Changed value** | Increased by 43% |
| `--space-2xl: 32px` | ❌ Not implemented | ❌ Missing | |
| `--space-3xl: 40px` | ❌ Not implemented | ❌ Missing | |

**Additional legacy spacing (backward compatibility):**
- `--s1: 4px` through `--s8: 40px`

**Verdict:** ⚠️ **Justifiable but significant deviation**
- ✅ Larger spacing improves touch target sizing
- ✅ More generous whitespace creates better visual breathing room
- ✅ Better suited for mobile/PWA interface
- ⚠️ Original values were too tight for modern touch interfaces
- ⚠️ Missing `--space-2xl` and `--space-3xl` but `--space-xl: 40px` covers the largest size

**Recommendation:** Document this intentional deviation in design system

---

### 🔄 Border Radius - IMPLEMENTED (naming + value changes)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `--radius-sm: 8px` | `--rSm: 8px` | 🔄 Abbreviated name | |
| `--radius-md: 12px` | `--rMd: 12px` | 🔄 Abbreviated name | |
| `--radius-lg: 24px` | `--rLg: 16px` | ⚠️ **Different value** | Smaller radius |
| ❌ Not in guideline | `--rXl: 24px` | ➕ Additional | Matches original --radius-lg |
| ❌ Not in guideline | `--rPill: 999px` | ➕ Additional | Fully rounded elements |

**Verdict:** 🔄 **Justifiable choice**
- ✅ Abbreviated names (`--rSm` vs `--radius-sm`) save characters
- ✅ Added `--rXl` provides more granular control
- ✅ `--rPill` useful for badges and pills
- 🔄 The original `--radius-lg: 24px` is now `--rXl: 24px`
- 🔄 `--rLg: 16px` fills the gap between 12px and 24px

**Recommendation:** This is an improvement over the original

---

### ⚠️ Shadows - IMPLEMENTED (naming + combined shadows)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `--shadow-card: 0 8px 24px rgba(0,0,0,0.6)` | `--shadowMd: 0 8px 24px rgba(0,0,0,0.6)` | 🔄 Different name | Abbreviated |
| `--shadow-button: 0 4px 12px rgba(...)` | `--shadowSm: 0 4px 12px rgba(...))` | 🔄 Different name | Separated |
| `--shadow-button-hover: 0 6px 20px rgba(...)` | `--shadow-button-hover: 0 6px 20px rgba(...))` | ✅ Same | Combined with inset |
| `--shadow-inset-card: inset 0 1px 0 rgba(...)` | `--innerHighlight: inset 0 1px 0 rgba(...)` | 🔄 Different name | More descriptive |
| `--shadow-inset-button: inset 0 1px 0 rgba(...)` | Combined into `--shadow-button` | 🔄 Combined | Practical choice |
| `--shadow-focus: 0 0 0 3px rgba(...)` | ❌ Not implemented | ⚠️ Missing | Focus uses outline instead |
| ❌ Not in guideline | `--shadowLg: 0 20px 50px rgba(...)` | ➕ Additional | Larger shadow |

**Combined shadow implementation:**
```css
/* Original: Apply separately */
box-shadow: var(--shadow-button), var(--shadow-inset-button);

/* Actual: Combined into one variable */
--shadow-button: 0 4px 12px rgba(...), inset 0 1px 0 rgba(...);
box-shadow: var(--shadow-button);
```

**Verdict:** 🔄 **Justifiable choice**
- ✅ Combining shadows reduces repetitive CSS
- ✅ Easier to apply consistent button styling
- ⚠️ Less flexible if you need just the inset or just the outer shadow
- ⚠️ Missing `--shadow-focus` but outline-based focus works well

---

### ✅ Motion - IMPLEMENTED (combined duration + easing)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `--duration-fast: 150ms` + `--easing: ease` | `--transition-fast: 0.15s ease` | 🔄 Combined | Practical choice |
| `--duration-normal: 200ms` + `--easing: ease` | `--transition-normal: 0.2s ease` | 🔄 Combined | Practical choice |
| `--duration-slow: 300ms` + `--easing: ease` | `--transition-slow: 0.3s ease` | 🔄 Combined | Practical choice |

**Original pattern (separate):**
```css
transition: all var(--duration-normal) var(--easing);
```

**Actual pattern (combined):**
```css
transition: all var(--transition-normal);
```

**Verdict:** ✅ **Justifiable improvement**
- ✅ Reduces typing
- ✅ More concise
- ✅ Less error-prone (can't forget easing)
- ⚠️ Less flexible if you need different easing functions

---

### ❌ Z-Index - NOT IMPLEMENTED

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `--z-base: 0` | Hardcoded `0` | ❌ Not implemented | Used in base.css |
| `--z-elevated: 1` | Hardcoded `1` | ❌ Not implemented | Used in base.css |
| `--z-overlay: 10` | Hardcoded `10`, `20` | ❌ Not implemented | Inconsistent |
| `--z-modal: 100` | Hardcoded `50`, `100` | ❌ Not implemented | Inconsistent |
| `--z-toast: 1000` | Hardcoded `9999`, `1000`, `998` | ❌ Not implemented | Very inconsistent |

**Actual z-index values found in codebase:**
- `0` - base.css (ambient glow)
- `1` - base.css (container)
- `10` - base.css (sticky tabs), forms.css
- `20` - base.css (sticky), player.css
- `50` - modals.css (backdrop)
- `100` - animations.css, cards.css (game header)
- `998`, `999`, `1000` - menu.css (side menu system)
- `9999` - animations.css (toast, fireworks)

**Verdict:** ❌ **SHOULD BE IMPLEMENTED**
- ❌ Hardcoded values throughout codebase
- ❌ No centralized z-index system
- ❌ Risk of z-index conflicts
- ❌ Difficult to maintain stacking order

**Recommendation:** **HIGH PRIORITY** - Implement z-index variables and refactor all hardcoded values

---

## 2. Google Fonts Import

| Original Guideline | Actual Implementation | Status |
|-------------------|----------------------|--------|
| `@import url('...')` | `@import url('...')` | ✅ Same |

**Verdict:** ✅ Implemented correctly

---

## 3. Base Styles

### ✅ Reset - IMPLEMENTED (with addition)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `margin: 0; padding: 0; box-sizing: border-box;` | Same | ✅ Same | |
| ❌ Not in guideline | `-webkit-tap-highlight-color: transparent;` | ➕ Additional | PWA improvement |

**Verdict:** ✅ Improvement - tap highlight removal essential for PWA

---

### ✅ Body - IMPLEMENTED (with additions)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| Basic body styles | Same + gradient background | 🔄 Enhanced | Better visual depth |
| ❌ Not in guideline | `padding-top: env(safe-area-inset-top)` | ➕ Additional | iPhone notch support |
| ❌ Not in guideline | `padding-bottom: env(safe-area-inset-bottom)` | ➕ Additional | iPhone home bar |

**Verdict:** ✅ Essential PWA enhancements

---

### ✅ Ambient Top Glow - IMPLEMENTED

**Verdict:** ✅ Implemented exactly as specified (except uses hardcoded z-index)

---

## 4. Component Classes

### ✅ Container - IMPLEMENTED

**Verdict:** ✅ Implemented with adapted variable names

---

### ❌ Header - NOT IMPLEMENTED (different pattern)

| Original Guideline | Actual Implementation | Status |
|-------------------|----------------------|--------|
| `.header` | Not used | ❌ Not implemented |
| `.header__title` (BEM) | Different pattern | ❌ Not implemented |
| `.header__tagline` (BEM) | Different pattern | ❌ Not implemented |

**Verdict:** ❌ BEM naming pattern not followed - uses different class structure

---

### ✅ Card - IMPLEMENTED

**Verdict:** ✅ Pattern implemented correctly with adapted variable names

---

### ✅ Section Header - IMPLEMENTED (different class name)

| Original Guideline | Actual Implementation | Status |
|-------------------|----------------------|--------|
| `.section-header` | `.section-title` | 🔄 Different name |

**Verdict:** ✅ Functionally equivalent, different name

---

### ✅ Score Row - IMPLEMENTED

**Verdict:** ✅ Pattern matches with adapted variable names

---

### 🔄 Buttons - IMPLEMENTED (no BEM modifier syntax)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `.btn--primary` (BEM) | `.btn-primary` | 🔄 Different syntax | Single dash instead of double |
| `.btn--secondary` (BEM) | `.btn-secondary` | 🔄 Different syntax | Single dash instead of double |
| `.btn--danger` (BEM) | `.btn-danger` | 🔄 Different syntax | Single dash instead of double |

**Verdict:** 🔄 **Justifiable deviation** - Simpler naming without BEM, patterns work identically

---

### ✅ Stats Grid - IMPLEMENTED

**Verdict:** ✅ Pattern matches perfectly

---

### ✅ Dice Display - IMPLEMENTED

**Verdict:** ✅ Pattern matches perfectly

---

### ✅ Accent Line - IMPLEMENTED

**Verdict:** ✅ Pattern matches perfectly

---

### ⚠️ Info Card - PARTIALLY IMPLEMENTED (different class name)

| Original Guideline | Actual Implementation | Status |
|-------------------|----------------------|--------|
| `.info-card` (BEM) | `.session-info` | 🔄 Different name |

**Verdict:** 🔄 Similar component, different name and purpose

---

## 5. Utility Classes

### ⚠️ Text Colors - PARTIALLY IMPLEMENTED

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `.text-primary` | ❌ Not implemented | ❌ Missing | Uses inline styles |
| `.text-secondary` | ❌ Not implemented | ❌ Missing | Uses inline styles |
| `.text-accent` | ❌ Not implemented | ❌ Missing | Uses inline styles |
| `.text-gold` | ❌ Not implemented | ❌ Missing | |
| `.text-gold-bright` | ❌ Not implemented | ❌ Missing | |
| `.text-success` | ❌ Not implemented | ❌ Missing | |
| `.text-danger` | ❌ Not implemented | ❌ Missing | |

**Instead, Tailwind-style utilities were implemented:**
- `.text-purple-600`, `.text-blue-600`, `.text-yellow-400`, etc.
- These map to theme colors but use generic Tailwind names

**Verdict:** ⚠️ **Different approach** - Uses Tailwind naming convention instead

---

### ⚠️ Font Utilities - PARTIALLY IMPLEMENTED

| Original Guideline | Actual Implementation | Status |
|-------------------|----------------------|--------|
| `.font-display` | ✅ Implemented | ✅ Same |
| `.font-body` | ✅ Implemented | ✅ Same |
| `.font-regular` | ✅ Implemented | ✅ Same |
| `.font-medium` | ✅ Implemented | ✅ Same |
| `.font-bold` | ✅ Implemented | ✅ Same |
| `.font-black` | ✅ Implemented | ✅ Same |

**Verdict:** ✅ Implemented correctly

---

### ❌ Text Sizes - NOT IMPLEMENTED (Tailwind instead)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `.text-xs` uses `--text-caption` | `.text-xs { font-size: 0.75rem; }` | ❌ Different | Tailwind rem-based |
| `.text-sm` uses `--text-body-sm` | `.text-sm { font-size: 0.875rem; }` | ❌ Different | Tailwind rem-based |
| `.text-base` uses `--text-body` | Not implemented | ❌ Missing | |
| `.text-lg` uses `--text-display-xs` | `.text-lg { font-size: 1.125rem; }` | ❌ Different | Tailwind rem-based |
| `.text-xl` uses `--text-display-sm` | `.text-xl { font-size: 1.25rem; }` | ❌ Different | Tailwind rem-based |
| `.text-2xl` uses `--text-display-md` | `.text-2xl { font-size: 1.5rem; }` | ❌ Different | Tailwind rem-based |
| `.text-3xl` uses `--text-display-lg` | `.text-3xl { font-size: 1.875rem; }` | ❌ Different | Tailwind rem-based |
| `.text-4xl` uses `--text-display-xl` | `.text-4xl { font-size: 2.25rem; }` | ❌ Different | Tailwind rem-based |

**Verdict:** ❌ **Completely different system** - Uses Tailwind rem scale instead of design tokens

---

### ❌ Spacing Utilities - NOT IMPLEMENTED (Tailwind instead)

| Original Guideline | Actual Implementation | Status | Notes |
|-------------------|----------------------|--------|-------|
| `.mt-sm` uses `--space-sm` | `.mt-4 { margin-top: 1rem; }` | ❌ Different | Tailwind naming |
| `.mb-lg` uses `--space-lg` | `.mb-4 { margin-bottom: 1rem; }` | ❌ Different | Tailwind naming |

**Verdict:** ❌ **Completely different system** - Uses Tailwind convention

---

### ❌ Label Utility - NOT IMPLEMENTED

| Original Guideline | Actual Implementation | Status |
|-------------------|----------------------|--------|
| `.label` | Not implemented | ❌ Missing |

**Verdict:** ❌ Not implemented

---

### ➕ Additional Utilities (not in guidelines)

Implemented but not in original guidelines:
- Flexbox: `.flex`, `.flex-col`, `.items-center`, `.justify-between`, etc.
- Grid: `.grid`, `.grid-cols-2`, `.grid-cols-3`
- Layout: `.w-full`, `.overflow-x-auto`, `.whitespace-nowrap`
- Border radius: `.rounded-sm`, `.rounded-md`, `.rounded-lg`
- Shadows: `.shadow-md`, `.shadow-lg`
- Padding: `.p-3`, `.p-4`, `.px-4`, `.py-4`
- Gap: `.gap-2`, `.gap-3`

**Verdict:** ✅ **Justifiable additions** - Essential modern utility classes

---

## 6. Accessibility

### ❌ Reduced Motion - NOT IMPLEMENTED

```css
/* Original guideline */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Status:** ❌ **NOT IMPLEMENTED**

**Impact:** Users with vestibular disorders cannot disable animations

---

### ❌ Focus-Visible - NOT IMPLEMENTED

```css
/* Original guideline */
.btn:focus:not(:focus-visible) {
  outline: none;
}

.btn:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}
```

**Status:** ❌ **NOT IMPLEMENTED**

**Impact:** Focus indicators show on mouse click (annoying) instead of only keyboard navigation

---

### ❌ High Contrast Mode - NOT IMPLEMENTED

```css
/* Original guideline */
@media (prefers-contrast: high) {
  :root {
    --border-faint: rgba(212, 165, 116, 0.3);
    --border-subtle: rgba(212, 165, 116, 0.4);
  }
}
```

**Status:** ❌ **NOT IMPLEMENTED**

**Impact:** Users with low vision don't get increased border contrast

---

## Summary Tables

### Implementation Status by Category

| Category | Status | Details |
|----------|--------|---------|
| **Colors** | ✅ Implemented | Different naming, all values present |
| **Typography** | 🔄 Mostly implemented | Different naming, missing fallbacks |
| **Spacing** | ⚠️ Partially implemented | Values intentionally changed |
| **Border Radius** | 🔄 Implemented | Abbreviated names, extra sizes |
| **Shadows** | 🔄 Implemented | Combined shadows, different naming |
| **Motion** | ✅ Implemented | Combined duration + easing |
| **Z-Index** | ❌ NOT IMPLEMENTED | All hardcoded |
| **Base Styles** | ✅ Implemented | With PWA enhancements |
| **Components** | 🔄 Mostly implemented | No BEM naming |
| **Utilities** | ⚠️ Different system | Tailwind instead of design tokens |
| **Accessibility** | ❌ NOT IMPLEMENTED | All 3 features missing |

---

### What's Implemented As-Is

1. ✅ **Color values** - All present with correct values
2. ✅ **Typography values** - Sizes and weights correct
3. ✅ **Spacing xs/sm** - Smallest sizes unchanged
4. ✅ **Border radius values** - Core sizes present
5. ✅ **Motion durations** - Correct timing values
6. ✅ **Base reset** - Reset styles implemented
7. ✅ **Ambient glow** - Background effect present
8. ✅ **Card component** - Pattern matches
9. ✅ **Score row** - Pattern matches
10. ✅ **Stats grid** - Pattern matches
11. ✅ **Dice display** - Pattern matches
12. ✅ **Accent line** - Pattern matches

---

### What's Implemented Differently (Justifiable)

1. 🔄 **Variable naming** - More explicit (`--font-weight-*` vs `--weight-*`)
2. 🔄 **Spacing values** - Increased for better touch targets
3. 🔄 **Border radius naming** - Abbreviated (`--rSm` vs `--radius-sm`)
4. 🔄 **Shadow naming** - Abbreviated and combined
5. 🔄 **Motion tokens** - Combined duration + easing into single values
6. 🔄 **Button classes** - Single dash (`.btn-primary`) instead of BEM (`.btn--primary`)
7. 🔄 **Utility classes** - Tailwind-style instead of design token references
8. 🔄 **Additional utilities** - Flexbox, grid, layout utilities added
9. 🔄 **Score-specific typography** - `--font-size-number-*` added
10. 🔄 **PWA enhancements** - Safe area insets, tap highlight removal

**Reasoning:** These changes improve developer experience, better suit touch interfaces, and add essential PWA features.

---

### What's NOT Implemented (Should Be Fixed)

1. ❌ **Z-index variables** - All hardcoded, inconsistent
2. ❌ **Font fallbacks** - Missing Georgia and system-ui
3. ❌ **Reduced motion** - Accessibility issue for vestibular disorders
4. ❌ **Focus-visible** - Focus indicators show on mouse clicks
5. ❌ **High contrast mode** - No support for low vision users
6. ❌ **Design token utilities** - Uses Tailwind rem instead of tokens
7. ❌ **BEM naming** - Not followed (but arguably not necessary)
8. ❌ **Some tracking values** - `--tracking-normal`, `--tracking-wide` missing
9. ❌ **Space 2xl/3xl** - Missing but covered by space-xl

---

## Recommendations

### 🔴 HIGH PRIORITY (Accessibility & Maintenance)

1. **Implement z-index variables** - Critical for maintainability
2. **Add `@media (prefers-reduced-motion)`** - WCAG 2.1 Level AA requirement
3. **Add `:focus-visible` support** - Better UX for mouse and keyboard users
4. **Add `@media (prefers-contrast: high)`** - Support for low vision users
5. **Add font fallbacks** - Better progressive enhancement

### 🟡 MEDIUM PRIORITY (Consistency)

6. **Document spacing value changes** - Make intentional deviation official
7. **Document naming convention differences** - Update design system
8. **Consider design token utilities** - Replace Tailwind rem with tokens

### 🟢 LOW PRIORITY (Nice to Have)

9. **Add missing tracking values** - For completeness
10. **Consider BEM adoption** - For larger teams (optional)

---

## Implementation Prompt for Missing Features

If you want to implement all missing features:

```
Implement missing CSS features from guidelines:

1. Z-INDEX VARIABLES (HIGH PRIORITY)
   Add to css/variables.css:
   --z-base: 0;
   --z-elevated: 1;
   --z-overlay: 10;
   --z-sticky: 20;
   --z-modal-backdrop: 50;
   --z-modal: 100;
   --z-menu: 1000;
   --z-toast: 9999;

   Replace hardcoded z-index in:
   - css/base.css (0, 1, 10, 20)
   - css/components/animations.css (100, 9999)
   - css/components/menu.css (998, 999, 1000)
   - css/components/modals.css (50)
   - css/components/cards.css (100)
   - css/components/player.css (20)
   - css/components/forms.css (10)

2. FONT FALLBACKS
   Update css/variables.css:
   --font-display: 'Playfair Display', Georgia, serif;
   --font-body: 'DM Sans', system-ui, sans-serif;

3. REDUCED MOTION (WCAG 2.1 AA)
   Add to css/base.css:
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }

4. FOCUS-VISIBLE
   Add to css/components/buttons.css, forms.css, dice.css, scores.css:
   .btn:focus:not(:focus-visible),
   .input:focus:not(:focus-visible),
   .die:focus:not(:focus-visible) {
     outline: none;
   }

   .btn:focus-visible,
   .input:focus-visible,
   .die:focus-visible {
     outline: 2px solid var(--gold-primary);
     outline-offset: 2px;
   }

5. HIGH CONTRAST MODE
   Add to css/variables.css:
   @media (prefers-contrast: high) {
     :root {
       --border-accent: rgba(212, 165, 116, 0.3);
       --border-subtle: rgba(212, 165, 116, 0.4);
     }
   }

6. MISSING TRACKING VALUES
   Add to css/variables.css:
   --letter-spacing-none: 0;
   --letter-spacing-normal: 0.5px;

These changes align with WCAG 2.1 AA accessibility standards and improve
maintainability without breaking existing functionality.
```

---

**Last Updated:** 2026-01-19
**Comparison based on:** Production CSS (commit 1a349de) vs Original Guidelines
