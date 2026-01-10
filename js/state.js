/**
 * Application State Management
 * Single source of truth for all app state
 */

// Global state object
export const S = {
  view: 'setup',
  known: JSON.parse(localStorage.getItem('yahtzeeP') || '[]'),
  game: [],
  cur: 0,
  history: JSON.parse(localStorage.getItem('yahtzeeH') || '[]'),
  savedGame: JSON.parse(localStorage.getItem('yahtzeeSaved') || 'null'),
  start: null,
  picker: null,
  mgr: false,
  stats: null,
  sideMenuOpen: false,
  virtualDiceExpanded: false, // Track if Virtual Dice mode options are expanded
  version: 'v1.0.0',
  // Game mode: 'score' (manual entry) or 'play' (with dice)
  mode: 'score',
  // Blitz mode settings
  isBlitzMode: false,
  blitzCategories: [], // 6 randomly selected category IDs
  turnTimer: null, // Timer ID
  turnStartTime: null, // When turn started (timestamp)
  turnTimeRemaining: 20, // Seconds remaining
  speedBonusEarned: false, // Did player score within 5 seconds?
  // Dice state for play mode
  dice: [1, 1, 1, 1, 1],
  held: [false, false, false, false, false],
  rollCount: 0,
  rolling: false,
  turnStarted: false,
  // Shake detection
  shakeEnabled: false,
  lastShake: 0,
  // History detail view
  selectedHistoryGame: null,
  historyDetailPlayer: 0,
  // End screen state
  finishedGame: null,
  revealIndex: -1,
  revealComplete: false,
  finishModal: false,
  earlyFinishModal: false,
  playerDetailsModal: false,
  // Track when bonus was just claimed (to show reminder)
  bonusJustClaimed: false,
  // Track all dice rolls for fun stats (Play Mode only)
  diceHistory: []
};

/**
 * Reset game-related state
 * Called when starting a new game or discarding saved game
 */
export function resetGameState() {
  S.game = [];
  S.cur = 0;
  S.start = null;
  S.picker = null;
  S.mode = 'score';
  S.isBlitzMode = false;
  S.blitzCategories = [];
  S.turnTimer = null;
  S.turnStartTime = null;
  S.turnTimeRemaining = 20;
  S.speedBonusEarned = false;
  S.dice = [1, 1, 1, 1, 1];
  S.held = [false, false, false, false, false];
  S.rollCount = 0;
  S.rolling = false;
  S.turnStarted = false;
  S.finishedGame = null;
  S.revealIndex = -1;
  S.revealComplete = false;
  S.finishModal = false;
  S.earlyFinishModal = false;
  S.playerDetailsModal = false;
  S.diceHistory = [];
}

/**
 * Reset dice state for a new turn
 */
export function resetDiceState() {
  // Clear timer if exists
  if (S.turnTimer) {
    clearInterval(S.turnTimer);
    S.turnTimer = null;
  }
  S.dice = [1, 1, 1, 1, 1];
  S.held = [false, false, false, false, false];
  S.rollCount = 0;
  S.rolling = false;
  S.turnStarted = false;
  S.turnStartTime = null;
  S.turnTimeRemaining = 20;
  S.speedBonusEarned = false;
}
