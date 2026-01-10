/**
 * Player Card Component
 * Used in the player carousel during game
 */

import { color, escapeHtml } from '../../utils/helpers.js';
import { grand } from '../../utils/scoring.js';

/**
 * Create an active player card (full stats)
 * @param {Object} player - Player object
 * @param {string} mode - 'active' or 'review'
 * @returns {string} HTML string
 */
export function activePlayerCard(player, mode = 'active') {
  const playerColor = color(player.id);
  const grandTotal = mode === 'review' ? player.total : grand(player.scores);
  const onClick = mode === 'review' ? '' : 'onclick="showPlayerDetails()"';

  return `
    <div class="player-card player-card-active"
         style="background:linear-gradient(135deg, ${playerColor} 0%, ${playerColor}dd 100%)"
         ${onClick}>
      <div class="player-card-header">
        <h3 class="player-name">${escapeHtml(player.name)}</h3>
        ${mode === 'active' ? '<div class="pulse-dot-small"></div>' : ''}
      </div>
      <div class="player-card-stats">
        <div class="stat-main">
          <div class="stat-label">Total</div>
          <div class="stat-value-large">${grandTotal}</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create an inactive player card (minimal info)
 * @param {Object} player - Player object
 * @param {number} index - Player index in game
 * @param {string} mode - 'active' or 'review'
 * @returns {string} HTML string
 */
export function inactivePlayerCard(player, index, mode = 'active') {
  const playerColor = color(player.id);
  const onClick = mode === 'review' ? `switchHistoryPlayer(${index})` : `switchPlayer(${index})`;

  return `
    <div class="player-card player-card-inactive"
         style="border-left:4px solid ${playerColor}"
         onclick="${onClick}">
      <div class="player-card-header">
        <h3 class="player-name player-name-inactive">${escapeHtml(player.name)}</h3>
      </div>
    </div>
  `;
}

/**
 * Create the player carousel
 * @param {Array} players - Array of player objects
 * @param {number} currentIndex - Index of current player
 * @param {string} mode - 'active' or 'review'
 * @returns {string} HTML string
 */
export function playerCarousel(players, currentIndex, mode = 'active') {
  const cards = players.map((player, index) => {
    return index === currentIndex
      ? activePlayerCard(player, mode)
      : inactivePlayerCard(player, index, mode);
  }).join('');

  return `
    <div class="player-carousel-container">
      <div class="player-carousel" id="playerCarousel">${cards}</div>
    </div>
  `;
}
