/**
 * Standings Component
 * Displays player standings/rankings
 */

import { color } from '../../utils/helpers.js';

/**
 * Create standings display for end screen
 * @param {Array} players - Array of player objects sorted by score
 * @param {number} maxScore - Highest score
 * @param {boolean} isRevealing - Whether in reveal animation
 * @param {number} visibleCount - Number of visible players
 * @param {boolean} revealComplete - Whether reveal is finished
 * @returns {string} HTML string
 */
export function standings(players, maxScore, isRevealing, visibleCount, revealComplete) {
  return players.map((p, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1);
    const isWinner = p.total === maxScore;
    const isVisible = idx < visibleCount;
    const isLast = idx === players.length - 1;
    const playerColor = color(p.pid);

    return `
      <div class="flex items-center gap-3 ${isWinner && revealComplete ? 'winner-row' : ''}"
           style="opacity:${isVisible ? '1' : '0'};transition:opacity 0.4s ease-out;margin-bottom:${isLast ? '0' : '0.875rem'}">
        <span class="text-2xl" style="width:2.5rem;text-align:center">${medal}</span>
        <div class="flex-1 rounded-xl bg-gray-100 overflow-hidden" style="height:3.5rem">
          <div class="standing-bar-end"
               style="background:${playerColor};width:${isVisible ? Math.max(30, (p.total / maxScore) * 100) : '0'}%">
            <span class="font-bold text-white px-3">${p.name}</span>
          </div>
        </div>
        <span class="font-black text-2xl"
              style="width:4.5rem;text-align:right;padding-right:0.5rem;color:${playerColor}">
          ${p.total}
        </span>
      </div>
    `;
  }).join('');
}

/**
 * Create standings display for history detail view
 * @param {Array} players - Array of player objects sorted by score
 * @param {number} maxScore - Highest score
 * @returns {string} HTML string
 */
export function historyStandings(players, maxScore) {
  return players.map((p, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1);
    const isLast = idx === players.length - 1;
    const playerColor = color(p.pid);

    return `
      <div class="flex items-center gap-3" style="margin-bottom:${isLast ? '0' : '0.875rem'}">
        <span class="text-2xl" style="width:2.5rem;text-align:center">${medal}</span>
        <div class="flex-1 rounded-xl bg-gray-100 overflow-hidden" style="height:3.5rem">
          <div class="standing-bar-end"
               style="background:${playerColor};width:${Math.max(30, (p.total / maxScore) * 100)}%">
            <span class="font-bold text-white px-3">${p.name}</span>
          </div>
        </div>
        <span class="font-black text-2xl"
              style="width:4.5rem;text-align:right;padding-right:0.5rem;color:${playerColor}">
          ${p.total}
        </span>
      </div>
    `;
  }).join('');
}
