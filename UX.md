# Schnitzel UX Patterns

## Interaction Principles

### Feedback Philosophy

Every interaction should feel:
- **Immediate**: Response within 100ms
- **Proportional**: Small actions get subtle feedback, significant actions get clear feedback
- **Informative**: User always knows what happened

### Touch Behavior

- Tap targets minimum 44×44px
- No delay on touch (avoid 300ms click delay)
- Visual feedback on touch-start, action on touch-end

---

## Navigation Patterns

### Mode Switching

The app has two primary modes:
1. **Score Mode**: Manual score entry with physical dice
2. **Play Mode**: Virtual dice with automatic scoring

Mode selection should be:
- Prominent on start
- Rememberable (persist last used)
- Switchable mid-session with confirmation

### Screen Flow

```
Start
  ├── New Game
  │     ├── Select Mode
  │     ├── Player Setup
  │     └── Game Screen
  │           ├── Scoring Interface
  │           ├── Round Summary
  │           └── Game Complete
  │                 └── Results/Stats
  ├── Continue Game (if saved)
  ├── History
  │     └── Past Game Detail
  ├── Statistics
  └── Settings
        ├── Export
        └── Import
```

### Back Navigation

- Always provide clear exit path
- Confirm before abandoning in-progress game
- Use system back gesture/button where available

---

## Game Flow

### Starting a Game

1. **Mode Selection**: Clear choice between Score/Play mode
2. **Player Setup**:
   - Quick add for 1 player (default)
   - Easy multi-player setup (1-8 players)
   - Player name editing
   - Reorder players
3. **Game Start**: Immediate transition to first turn

### During Game

**Score Mode**:
- All categories visible
- Tap category → enter score
- Clear indication of filled vs available categories
- Running total always visible

**Play Mode**:
- Dice prominently displayed
- Shake or tap to roll
- Tap individual dice to hold
- Roll counter (3 max per turn)
- Available scores highlighted based on dice
- Auto-calculate and display potential scores

### Turn Progression

- Clear indication of current player
- Auto-advance to next player after score entry
- Option to undo last action
- Round indicator visible

### Completing a Game

1. Final scores displayed
2. Winner highlighted
3. Statistics updated
4. Options: New Game, View Stats, Share Results

---

## Scoring Interface

### Score Entry (Score Mode)

**Input Method**:
- Numeric keypad optimized for scoring
- Quick-entry shortcuts for common values
- Zero entry allowed (scratching)

**Validation**:
- Enforce valid score ranges per category
- Confirm unusual scores (e.g., 0 for Yahtzee)

### Score Selection (Play Mode)

**Presentation**:
- Show all categories
- Highlight valid options based on current dice
- Display calculated score for each valid option
- Dim/disable already-used categories

**Selection**:
- Tap to select
- Confirm before committing (or auto-commit setting)

### Score Display

| State | Appearance |
|-------|------------|
| Empty | Em dash (—) |
| Filled | Score value in gold |
| Potential | Calculated value, lower opacity |
| Invalid | Dimmed, non-interactive |
| Bonus achieved | Highlighted in bright gold |

---

## Dice Interactions (Play Mode)

### Rolling

**Methods**:
1. Shake device (with haptic feedback)
2. Tap roll button
3. Swipe gesture on dice area

**Animation**:
- Dice tumble briefly (300-500ms)
- Land with slight bounce
- Settle into position

**Constraints**:
- Maximum 3 rolls per turn
- Must keep at least one die after each roll (optional rule)
- Clear roll counter

### Holding Dice

**Interaction**: Tap die to toggle hold state

**Visual States**:
| State | Appearance |
|-------|------------|
| Active | Full opacity, ready to roll |
| Held | Elevated, gold border, slight glow |

**Feedback**: Haptic on toggle

### Dice Presentation

- Large enough to tap easily (min 56px)
- Clear pip display
- Slight rotation variance for natural look
- Smooth transitions between states

---

## Data Patterns

### Auto-Save

- Save game state after every score entry
- Save immediately (don't wait for debounce)
- Silent save (no UI indication needed)
- Resume capability on app reopen

### Game Recovery

On app launch, check for incomplete game:
- If found: Prompt to continue or start new
- Show game preview (players, round, scores)

### Export/Import

**Export**:
- All game history
- All player statistics
- Current game state (if any)
- JSON format
- Copy to clipboard or save file

**Import**:
- Validate data structure
- Warn about overwriting existing data
- Merge option for player stats
- Preview before confirming

---

## Feedback Patterns

### Success States

- Score saved: Brief highlight of row
- Game complete: Celebration moment (subtle, not intrusive)
- Yahtzee: Special recognition animation
- Bonus achieved: Highlight bonus row

### Error States

- Invalid input: Shake animation + message
- Network error: Toast with retry option
- Data corruption: Clear explanation + recovery steps

### Loading States

- Prefer optimistic UI (assume success)
- For longer operations: Subtle spinner, not blocking
- Skeleton screens for content loading

---

## Empty States

### No Games Yet

- Welcoming message
- Clear call-to-action to start first game
- Brief feature highlight

### No Statistics

- Explain what will appear after games
- Encourage first game

### No History

- "Your completed games will appear here"
- Quick action to start a game

---

## Confirmation Patterns

### When to Confirm

- Deleting game history
- Clearing all data
- Abandoning in-progress game
- Importing data (overwrites existing)
- Unusual score entries

### When NOT to Confirm

- Normal score entry
- Starting new game (no active game)
- Navigation between screens
- Holding/releasing dice

### Confirmation UI

- Modal dialog for destructive actions
- Clear description of consequence
- Distinct primary/secondary actions
- Danger styling for destructive confirm button

---

## Player Management

### Adding Players

- "Add Player" always visible during setup
- Default name suggestion (Player 1, Player 2...)
- Inline editing of names
- Maximum 8 players

### Player Order

- Drag to reorder during setup
- Order locked once game starts
- Visual turn indicator during game

### Player Persistence

- Remember recently used players
- Suggest previous players for new games
- Player statistics tied to name

---

## Statistics Display

### Per-Player Stats

- Total games played
- Wins / Win rate
- High score
- Average score
- Yahtzee count
- Favorite categories (most points from)

### Global Stats

- Total games completed
- Total Yahtzees rolled
- Highest score ever
- Most common winning score range

### Presentation

- Use charts sparingly, prefer clear numbers
- Compare to averages where meaningful
- Historical trend if sufficient data

---

## Accessibility Patterns

### Screen Reader Support

- Meaningful labels for all interactive elements
- Announce score changes
- Announce turn changes
- Announce dice values after roll

### Motor Accessibility

- Large touch targets
- No time-limited interactions
- Alternative to shake (always provide tap)
- No drag required (tap alternatives available)

### Visual Accessibility

- Sufficient contrast (AA minimum)
- Don't rely on color alone
- Support dynamic text sizing
- Clear focus indicators

### Cognitive Accessibility

- Consistent layout
- Clear current state indication
- Undo capability
- No hidden gestures required

---

## Performance Patterns

### Perceived Performance

- Respond to input immediately
- Animate meaningfully (not just to delay)
- Progressive loading for history

### Actual Performance

- Minimize re-renders
- Debounce expensive operations
- Cache computed values
- Lazy load non-critical features

### Offline Behavior

- Full functionality offline
- Clear indication of offline state (if relevant)
- Sync when back online (if applicable)

---

## Implementation Status

### ✅ Fully Implemented

1. **Touch Behavior** - 44×44px targets (most buttons), no click delays
2. **Mode Switching** - Clear selection UI with persistence
3. **Auto-Save** - State saved after every significant action
4. **Dice Interactions** - Tap to hold, shake to roll, clear visual states
5. **Score Display States** - Empty (—), Filled (gold), Potential (lower opacity)
6. **Feedback Patterns** - Toast notifications, haptics, fireworks for Yahtzee
7. **Confirmation Dialogs** - Browser confirms for destructive actions, modals for game-ending

### ⚠️ Partially Implemented

8. **Accessibility** - Focus indicators present, but missing:
   - ARIA labels and roles
   - Keyboard navigation enhancements
   - `prefers-reduced-motion` support
   - Live regions for dynamic updates
   - Focus management in modals

### Implementation Details

**File References**:
- Game state: `js/state.js`, `js/storage.js`
- Dice logic: `js/dice.js`, `js/diceArea.js`
- Mode selection: `js/screens/setup.js`
- Feedback: `js/toast.js`, `js/fireworks.js`
- Scoring: `js/screens/game.js`, `js/score.js`
- Styles: `css/components/buttons.css`, `css/components/dice.css`, `css/components/scores.css`

**Touch Target Sizes** (CSS):
- `.btn-primary`: ~48px height ✅
- `.roll-btn`: ~48px height ✅
- `.game-mode-btn`: 140px height ✅
- `.die`: 48×48px ✅
- `.btn-icon`: 40×40px ⚠️ (slightly below minimum)
- `.btn-icon-sm`: 24px ❌ (too small)

**Auto-Save Triggers** (JS):
- After score entry: `app.js:426, 494`
- After player switch: `app.js:377`
- After clearing score: `app.js:440`
- After Yahtzee bonus: `app.js:454`
- When pausing game: `app.js:316`

---

## Future Enhancements

### Accessibility Improvements

1. **ARIA Support**
   - Add `aria-label` to all interactive elements
   - Use `role="button"` for custom buttons
   - Add `aria-live="polite"` for toast notifications
   - Add `aria-live="assertive"` for score updates

2. **Keyboard Navigation**
   - Add keyboard handlers (Escape to close modals, Enter to confirm)
   - Implement focus trap for modals
   - Add visible skip links
   - Add keyboard shortcuts for common actions

3. **Motion Preferences**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

4. **Focus Management**
   - Store previous focus before modal opens
   - Move focus to modal on open
   - Trap focus within modal
   - Restore focus on close

### Additional UX Enhancements

- **Undo/Redo**: Allow undoing last score entry
- **History Navigation**: Swipe between past games
- **Gestures**: Swipe dice area to roll (in addition to shake)
- **Voice Input**: Voice-activated score entry
- **Offline Indicator**: Show when offline (though app works fully offline)

---

**Last Updated:** 2026-01-19
**Author:** Extracted from production implementation with verification report
