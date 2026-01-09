/**
 * Router
 * Handles navigation and browser history
 */

import { S } from './state.js';

// Store render callback
let renderFn = null;

/**
 * Initialize router with render function
 * @param {Function} render - Render callback function
 */
export function initRouter(render) {
  renderFn = render;

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (event) => {
    const previousView = S.view;

    if (event.state && event.state.view) {
      S.view = event.state.view;

      // Restore history detail state if present
      if (S.view === 'history' && event.state.gameId) {
        const game = S.history.find(h => h.id === event.state.gameId);
        if (game) {
          S.selectedHistoryGame = game;
          S.historyDetailPlayer = 0;
        }
      } else if (S.view === 'history') {
        S.selectedHistoryGame = null;
        S.historyDetailPlayer = 0;
      }
    } else {
      S.view = 'setup';
      S.selectedHistoryGame = null;
      S.historyDetailPlayer = 0;
    }

    // If going from game back to setup, clear game state
    if (previousView === 'game' && S.view === 'setup') {
      S.game = [];
      S.cur = 0;
    }

    renderFn();
  });

  // Initialize history state
  history.replaceState({ view: S.view }, '', '#' + S.view);
}

/**
 * Navigate to a different view
 * @param {string} view - View name
 */
export function navigateTo(view) {
  S.view = view;

  // Clear history detail state when navigating to history list
  if (view === 'history') {
    S.selectedHistoryGame = null;
    S.historyDetailPlayer = 0;
  }

  history.pushState({ view: view }, '', '#' + view);
  renderFn();
}

/**
 * Navigate to history detail view
 * @param {number} gameId - Game ID
 */
export function navigateToHistoryDetail(gameId) {
  const game = S.history.find(h => h.id === gameId);
  if (game) {
    S.selectedHistoryGame = game;
    S.historyDetailPlayer = 0;
    history.pushState({ view: 'history', gameId: gameId }, '', '#history-detail');
    renderFn();
  }
}

/**
 * Go back in history
 */
export function goBack() {
  history.back();
}

/**
 * Update theme color meta tag
 */
export function updateThemeColor() {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) return;

  const styles = getComputedStyle(document.documentElement);
  const accentColor = styles.getPropertyValue('--accent').trim();
  const bgColor = styles.getPropertyValue('--bg').trim();

  if (S.view === 'setup') {
    metaThemeColor.setAttribute('content', bgColor);
  } else {
    metaThemeColor.setAttribute('content', accentColor);
  }
}
