/**
 * Main Application Entry Point
 * Initializes the app and exposes global functions for onclick handlers
 */

import { S, resetDiceState, resetGameState } from './state.js';
import { COLORS } from './constants.js';
import { upTot, upBonus, loTot, grand, calcScore, getPossibleScores } from './utils/scoring.js';
import { save, saveCurrentGame, clearSavedGame, empty, isGameComplete, createGameRecord } from './utils/storage.js';
import { color, vibrate } from './utils/helpers.js';
import { rollDice as rollDiceService, toggleHold as toggleHoldService, resetDiceForTurn, startTurn as startTurnService, setupShakeDetection, dieFace } from './services/dice.js';
import { showToast } from './services/toast.js';
import { showFireworks, startFireworksCanvas } from './services/fireworks.js';
import { exportData as exportDataService, triggerImport as triggerImportService } from './services/export.js';
import { initPWA, forceUpdate as forceUpdateService, loadVersion } from './services/pwa.js';
import { initRouter, navigateTo as navigateToRouter, navigateToHistoryDetail, goBack, updateThemeColor } from './router.js';
import { setupView } from './views/setup.js';
import { gameView } from './views/game.js';
import { historyListView, historyDetailView } from './views/history.js';
import { endScreenView, animateReveal, skipReveal as skipRevealFn } from './views/endScreen.js';

// ============================================
// RENDER FUNCTION
// ============================================

// Track the last rendered player for carousel animation
let lastRenderedPlayer = null;
let savedCarouselScroll = 0;

function R() {
  // Save carousel scroll position BEFORE re-render
  const carousel = document.getElementById('playerCarousel');
  if (carousel) {
    savedCarouselScroll = carousel.scrollLeft;
  }

  // Check if player changed (for animation decision)
  const playerChanged = lastRenderedPlayer !== null && lastRenderedPlayer !== S.cur;

  const app = document.getElementById('app');

  if (S.view === 'setup') {
    app.innerHTML = setupView();
    lastRenderedPlayer = null; // Reset when leaving game view
  } else if (S.view === 'history') {
    if (S.selectedHistoryGame) {
      app.innerHTML = historyDetailView();
    } else {
      app.innerHTML = historyListView();
    }
    lastRenderedPlayer = null;
  } else if (S.view === 'endScreen') {
    app.innerHTML = endScreenView();
    setTimeout(() => {
      startFireworksCanvas();
      animateReveal();
    }, 100);
    lastRenderedPlayer = null;
  } else {
    // Game view
    app.innerHTML = gameView();

    // Handle carousel scroll position
    const newCarousel = document.getElementById('playerCarousel');
    if (newCarousel) {
      // Always restore scroll position immediately first (prevents jump to 0)
      newCarousel.scrollLeft = savedCarouselScroll;

      if (playerChanged) {
        // Player changed: animate from current (restored) position to new player
        // Use double RAF to ensure the scroll restoration has taken effect
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollCarouselToActivePlayer(newCarousel);
          });
        });
      }
    }

    lastRenderedPlayer = S.cur;
  }

  updateThemeColor();
}

/**
 * Scroll the carousel to show the active player card with smooth animation
 * @param {HTMLElement} [carousel] - Optional carousel element (avoids re-query)
 */
function scrollCarouselToActivePlayer(carousel) {
  const el = carousel || document.getElementById('playerCarousel');
  if (!el) return;

  const activeCard = el.querySelector('.player-card-active');
  if (!activeCard) return;

  // Calculate target scroll position (align card to start with padding)
  const targetScroll = activeCard.offsetLeft - 12; // 12px = 0.75rem padding

  el.scrollTo({
    left: Math.max(0, targetScroll),
    behavior: 'smooth'
  });
}

// Make R, S, and save available globally for onclick handlers
window.R = R;
window.S = S;
window.save = save;

// ============================================
// GLOBAL FUNCTIONS FOR ONCLICK HANDLERS
// ============================================

// Navigation
window.navigateTo = (view) => navigateToRouter(view);
window.viewHistoryGame = (gameId) => navigateToHistoryDetail(gameId);
window.closeHistoryDetail = () => goBack();
window.switchHistoryPlayer = (index) => {
  S.historyDetailPlayer = index;
  R();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Side menu
window.toggleSideMenu = () => {
  S.sideMenuOpen = !S.sideMenuOpen;
  R();
};

// Export/Import
window.exportData = () => exportDataService();
window.triggerImport = () => triggerImportService(R);
window.forceUpdate = () => forceUpdateService();

// Player management
window.tog = (id) => {
  const p = S.known.find(x => x.id === id);
  const existing = S.game.find(x => x.id === id);
  if (existing) {
    S.game = S.game.filter(x => x.id !== id);
  } else if (S.game.length < 8) {
    S.game.push({ ...p, scores: empty() });
  }
  R();
};

window.mv = (i, d) => {
  const ni = i + d;
  if (ni < 0 || ni >= S.game.length) return;
  const t = S.game[i];
  S.game[i] = S.game[ni];
  S.game[ni] = t;
  R();
};

window.addP = () => {
  const inp = document.getElementById('np');
  if (inp && inp.value.trim()) {
    S.known.push({ id: Date.now(), name: inp.value.trim() });
    inp.value = '';
    save();
    R();
  }
};

window.ren = (id, name) => {
  const p = S.known.find(x => x.id === id);
  if (p && name.trim()) p.name = name.trim();
  save();
};

window.del = (id) => {
  if (confirm('Delete player?')) {
    S.known = S.known.filter(x => x.id !== id);
    S.game = S.game.filter(x => x.id !== id);
    save();
    R();
  }
};

window.delH = (id) => {
  if (confirm('Delete game?')) {
    S.history = S.history.filter(x => x.id !== id);
    save();
    R();
  }
};

// Game control
window.startGameWithMode = (mode) => {
  if (S.game.length === 0) return;
  S.mode = mode;
  S.start = Date.now();
  S.cur = 0;
  clearSavedGame();

  if (mode === 'play') {
    resetDiceForTurn();
    setupShakeDetection(() => rollDiceService(R));
  }

  navigateToRouter('game');
};

window.resumeGame = () => {
  if (S.savedGame) {
    S.game = S.savedGame.game;
    S.cur = S.savedGame.cur;
    S.start = S.savedGame.start;
    if (S.savedGame.mode) {
      S.mode = S.savedGame.mode;
      S.dice = S.savedGame.dice || [1, 1, 1, 1, 1];
      S.held = S.savedGame.held || [false, false, false, false, false];
      S.rollCount = S.savedGame.rollCount || 0;
      S.turnStarted = S.savedGame.turnStarted || false;
      if (S.mode === 'play') {
        setupShakeDetection(() => rollDiceService(R));
      }
    }
    showToast('Game resumed!');
    navigateToRouter('game');
  }
};

window.discardSaved = () => {
  if (confirm('Discard saved game?')) {
    clearSavedGame();
    S.game = [];
    S.cur = 0;
    R();
  }
};

window.pauseG = () => {
  saveCurrentGame();
  S.game = [];
  S.cur = 0;
  showToast('Game paused & saved! ⏸️');
  navigateToRouter('setup');
};

window.finishG = () => {
  if (isGameComplete()) {
    S.finishModal = true;
  } else {
    S.earlyFinishModal = true;
  }
  R();
};

window.confirmFinish = () => {
  vibrate([100, 50, 100, 50, 200]);
  S.finishedGame = createGameRecord();
  S.revealIndex = -1;
  S.revealComplete = false;
  S.finishModal = false;
  navigateToRouter('endScreen');
};

window.confirmEarlyFinish = () => {
  // Fill remaining null scores with 0
  S.game.forEach(p => {
    Object.keys(p.scores).forEach(k => {
      if (k !== 'bonus' && p.scores[k] === null) {
        p.scores[k] = 0;
      }
    });
  });
  vibrate([100, 50, 100]);
  S.earlyFinishModal = false;
  S.finishModal = true;
  R();
};

window.saveAndExit = () => {
  if (S.finishedGame) {
    S.history.unshift(S.finishedGame);
    save();
    S.finishedGame = null;
  }
  clearSavedGame();
  S.game = [];
  S.cur = 0;
  navigateToRouter('setup');
};

window.skipReveal = () => skipRevealFn();

// Player switching
window.switchPlayer = (index) => {
  if (index === S.cur) return;
  if (S.mode === 'play') {
    resetDiceForTurn();
  }
  S.cur = index;
  saveCurrentGame();
  R(); // R() automatically animates carousel when player changes
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showPlayerDetails = () => {
  S.playerDetailsModal = true;
  R();
};

// Dice functions
window.rollDice = () => rollDiceService(R);
window.toggleHold = (index) => toggleHoldService(index, R);
window.startTurn = () => startTurnService(R);

// Score entry (Score Mode)
window.openUp = (id, v, name) => {
  S.picker = { id, v, name, t: 'upper' };
  R();
};

window.openLo = (id, type, v, name) => {
  S.picker = { id, v, name, t: type };
  R();
};

window.sel = (v) => {
  S.game[S.cur].scores[S.picker.id] = v;

  if (S.picker.id === 'yahtzee' && v === 50) {
    showFireworks();
    showToast('🎉 YAHTZEE!');
  }

  S.picker = null;

  if (isGameComplete()) {
    vibrate([100, 50, 100, 50, 200]);
    saveCurrentGame();
    S.finishModal = true;
    R();
    return;
  }

  // Auto-advance
  const nextPlayer = (S.cur + 1) % S.game.length;
  const nextPlayerName = S.game[nextPlayer].name;
  S.cur = nextPlayer;
  saveCurrentGame();
  R(); // R() automatically animates carousel when player changes
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(nextPlayerName + "'s turn");
};

window.subCust = () => {
  const inp = document.getElementById('cust');
  const v = parseInt(inp.value);
  if (v >= 0 && v <= 30) window.sel(v);
};

window.clr = (id) => {
  S.game[S.cur].scores[id] = null;
  saveCurrentGame();
  R();
};

window.addBonus = () => {
  if (S.game[S.cur].scores.yahtzee === 50) {
    S.game[S.cur].scores.bonus += 100;
    showFireworks();
    showToast('YAHTZEE BONUS! +100');
    saveCurrentGame();
    R();
  }
};

// Score entry (Play Mode)
window.selectPlayScore = (categoryId, score) => {
  const cp = S.game[S.cur];

  // Handle Yahtzee bonus
  if (calcScore(S.dice, 'yahtzee') === 50 && cp.scores.yahtzee === 50) {
    cp.scores.bonus += 100;
    showToast('YAHTZEE BONUS! +100');
    showFireworks();
  }

  cp.scores[categoryId] = score;

  if (isGameComplete()) {
    vibrate([100, 50, 100, 50, 200]);
    resetDiceForTurn();
    saveCurrentGame();
    S.finishModal = true;
    R();
    return;
  }

  const nextPlayer = (S.cur + 1) % S.game.length;
  const nextPlayerName = S.game[nextPlayer].name;
  S.cur = nextPlayer;
  resetDiceForTurn();
  saveCurrentGame();
  R(); // R() automatically animates carousel when player changes
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(nextPlayerName + "'s turn");
};

// ============================================
// INITIALIZATION
// ============================================

// Initialize router
initRouter(R);

// Initial render
R();

// Load version
loadVersion(R);

// Initialize PWA
initPWA();
