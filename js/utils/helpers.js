/**
 * General Helper Functions
 */

import { S } from '../state.js';
import { COLORS } from '../constants.js';

/**
 * Get player color based on their position in known players
 * @param {number} playerId - Player ID
 * @returns {string} Hex color code
 */
export function color(playerId) {
  const index = S.known.findIndex(p => p.id === playerId);
  return COLORS[index % COLORS.length];
}

/**
 * Trigger haptic feedback (vibration)
 * @param {number|number[]} pattern - Vibration duration or pattern
 */
export function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/**
 * Format date for display
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString();
}

/**
 * Format time for display
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted time (HH:MM)
 */
export function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}
