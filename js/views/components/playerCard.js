/**
 * Player Card Component
 * Used in the player carousel during game
 */

import { color } from '../../utils/helpers.js';
import { grand } from '../../utils/scoring.js';

/**
 * Create an active player card (full stats)
 * @param {Object} player - Player object
 * @returns {string} HTML string
 */
export function activePlayerCard(player) {
  const playerColor = color(player.id);
  const grandTotal = grand(player.scores);

  return `
    <div class="player-card player-card-active"
         style="background:linear-gradient(135deg, ${playerColor} 0%, ${playerColor}dd 100%)"
         onclick="showPlayerDetails()">
      <div class="player-card-header">
        <h3 class="player-name">${player.name}</h3>
        <div class="pulse-dot-small"></div>
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
 * @returns {string} HTML string
 */
export function inactivePlayerCard(player, index) {
  const playerColor = color(player.id);

  return `
    <div class="player-card player-card-inactive"
         style="border-left:4px solid ${playerColor}"
         onclick="switchPlayer(${index})">
      <div class="player-card-header">
        <h3 class="player-name player-name-inactive">${player.name}</h3>
      </div>
    </div>
  `;
}

/**
 * Create the player carousel
 * @param {Array} players - Array of player objects
 * @param {number} currentIndex - Index of current player
 * @returns {string} HTML string
 */
export function playerCarousel(players, currentIndex) {
  const cards = players.map((player, index) => {
    return index === currentIndex
      ? activePlayerCard(player)
      : inactivePlayerCard(player, index);
  }).join('');

  return `
    <div class="player-carousel-container">
      <div class="player-carousel" id="playerCarousel">${cards}</div>
    </div>
  `;
}
