/**
 * LocalStorage Utility Functions
 * Handles all localStorage operations
 */

import { S } from '../state.js';
import { grand } from './scoring.js';

/**
 * Save players and history to localStorage
 */
export function save() {
  localStorage.setItem('yahtzeeP', JSON.stringify(S.known));
  localStorage.setItem('yahtzeeH', JSON.stringify(S.history));
}

/**
 * Save current game state to localStorage
 */
export function saveCurrentGame() {
  const gameState = {
    game: S.game,
    cur: S.cur,
    start: S.start,
    savedAt: Date.now(),
    // Save play mode state
    mode: S.mode,
    isBlitzMode: S.isBlitzMode,
    blitzCategories: S.blitzCategories,
    dice: S.dice,
    held: S.held,
    rollCount: S.rollCount,
    turnStarted: S.turnStarted,
    turnStartTime: S.turnStartTime,
    turnTimeRemaining: S.turnTimeRemaining,
    speedBonusEarned: S.speedBonusEarned,
    diceHistory: S.diceHistory
  };
  localStorage.setItem('yahtzeeSaved', JSON.stringify(gameState));
  S.savedGame = gameState;
}

/**
 * Clear saved game from localStorage
 */
export function clearSavedGame() {
  localStorage.removeItem('yahtzeeSaved');
  S.savedGame = null;
}

/**
 * Create an empty scores object
 * @returns {Object} Empty scores object with all categories null and bonus 0
 */
export function empty() {
  return {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfKind: null,
    fourOfKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
    bonus: 0,
    speedBonuses: {} // Track which categories earned speed bonus (blitz mode)
  };
}

/**
 * Ensure scores object has speedBonuses field (backward compatibility)
 * @param {Object} scores - Player scores object
 * @returns {Object} Scores object with speedBonuses
 */
export function ensureSpeedBonuses(scores) {
  if (!scores.speedBonuses) {
    scores.speedBonuses = {};
  }
  return scores;
}

/**
 * Check if a category has a speed bonus
 * @param {Object} scores - Player scores object
 * @param {string} categoryId - Category ID to check
 * @returns {boolean} True if category has speed bonus
 */
export function hasSpeedBonus(scores, categoryId) {
  // Backward compatibility: if speedBonuses doesn't exist, return false
  if (!scores.speedBonuses) return false;
  return scores.speedBonuses[categoryId] === true;
}

/**
 * Check if all scores are filled for all players
 * @returns {boolean} True if game is complete
 */
export function isGameComplete() {
  // In blitz mode, only check the 6 selected categories
  if (S.isBlitzMode && S.blitzCategories.length > 0) {
    return S.game.every(p => {
      return S.blitzCategories.every(catId => p.scores[catId] !== null);
    });
  }

  // Standard game: check all categories
  return S.game.every(p => {
    const s = p.scores;
    return s.ones !== null && s.twos !== null && s.threes !== null &&
           s.fours !== null && s.fives !== null && s.sixes !== null &&
           s.threeOfKind !== null && s.fourOfKind !== null && s.fullHouse !== null &&
           s.smallStraight !== null && s.largeStraight !== null &&
           s.yahtzee !== null && s.chance !== null;
  });
}

/**
 * Create a game record for history
 * @returns {Object} Game record
 */
export function createGameRecord() {
  const record = {
    id: Date.now(),
    date: new Date().toISOString(),
    dur: S.start ? Math.round((Date.now() - S.start) / 60000) : null,
    mode: S.mode, // 'score' or 'play'
    isBlitzMode: S.isBlitzMode || false, // Blitz mode flag
    players: S.game.map(p => ({
      pid: p.id,
      name: p.name,
      scores: { ...p.scores },
      total: grand(p.scores)
    }))
  };

  // Include dice history for Play Mode games
  if (S.mode === 'play' && S.diceHistory.length > 0) {
    record.diceHistory = [...S.diceHistory];
  }

  return record;
}
