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
    dice: S.dice,
    held: S.held,
    rollCount: S.rollCount,
    turnStarted: S.turnStarted
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
    bonus: 0
  };
}

/**
 * Check if all scores are filled for all players
 * @returns {boolean} True if game is complete
 */
export function isGameComplete() {
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
 * Save finished game to history
 */
export function saveFinishedGame() {
  if (S.finishedGame) {
    S.history.unshift(S.finishedGame);
    save();
    S.finishedGame = null;
  }
  clearSavedGame();
}

/**
 * Create a game record for history
 * @returns {Object} Game record
 */
export function createGameRecord() {
  return {
    id: Date.now(),
    date: new Date().toISOString(),
    dur: S.start ? Math.round((Date.now() - S.start) / 60000) : null,
    players: S.game.map(p => ({
      pid: p.id,
      name: p.name,
      scores: { ...p.scores },
      total: grand(p.scores)
    }))
  };
}
