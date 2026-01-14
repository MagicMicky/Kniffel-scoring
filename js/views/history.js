/**
 * History View
 * Game history list and detail views
 */

import { S } from '../state.js';
import { color, formatDate, formatTime, escapeHtml } from '../utils/helpers.js';
import { gameView } from './game.js';

/**
 * Render history list view
 * @returns {string} HTML string
 */
export function historyListView() {
  const gamesList = S.history.length === 0
    ? noHistoryMessage()
    : historyGamesList();

  return `
    <div class="container" style="min-height:100vh">
      <div class="flex items-center justify-between mb-6">
        <button class="btn-text text-purple-200 text-lg font-medium" onclick="navigateTo('setup')">
          ← Back
        </button>
        <h1 class="text-2xl font-black text-white">📜 History</h1>
        <div style="width:4rem"></div>
      </div>
      <div class="space-y-3">${gamesList}</div>
    </div>
  `;
}

/**
 * Create no history message
 */
function noHistoryMessage() {
  return `
    <div class="text-center py-5 text-purple-200">
      <p class="text-5xl mb-4">📜</p>
      <p>No games yet</p>
    </div>
  `;
}

/**
 * Get game mode badge info
 * @param {Object} game - Game record
 * @returns {Object} Badge info with icon, label, and cssClass
 */
function getModeBadge(game) {
  if (game.isBlitzMode) {
    return {
      icon: '⚡',
      label: 'Blitz',
      cssClass: 'mode-badge-blitz'
    };
  } else if (game.mode === 'play') {
    return {
      icon: '🎲',
      label: 'Play',
      cssClass: 'mode-badge-play'
    };
  } else {
    return {
      icon: '📝',
      label: 'Score',
      cssClass: 'mode-badge-score'
    };
  }
}

/**
 * Create history games list
 */
function historyGamesList() {
  return S.history.map(game => {
    const sorted = [...game.players].sort((a, b) => b.total - a.total);
    const playersList = sorted.map((p, i) => {
      const isWinner = i === 0;
      const playerColor = color(p.pid);
      return `
        <div class="flex justify-between items-center ${isWinner ? 'text-yellow-400 font-bold' : 'text-white'}">
          <div class="flex items-center gap-2">
            <div class="color-dot-sm" style="background:${playerColor}"></div>
            <span>${isWinner ? '🏆 ' : ''}${escapeHtml(p.name)}</span>
          </div>
          <span class="text-lg">${p.total}</span>
        </div>
      `;
    }).join('');

    const duration = game.dur ? ` • ${game.dur}m` : '';
    const modeBadge = getModeBadge(game);

    return `
      <div class="glass rounded-2xl p-4" style="cursor:pointer;transition:all 0.15s"
           onclick="viewHistoryGame(${game.id})"
           onmouseover="this.style.background='rgba(255,255,255,0.15)'"
           onmouseout="this.style.background='rgba(255,255,255,0.1)'">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="font-bold text-white">${formatDate(game.date)}</p>
              <span class="mode-badge ${modeBadge.cssClass}">
                ${modeBadge.icon} ${modeBadge.label}
              </span>
            </div>
            <p class="text-sm text-purple-200">${formatTime(game.date)}${duration}</p>
          </div>
          <button class="delete-btn" onclick="event.stopPropagation();delH(${game.id})">🗑️</button>
        </div>
        <div class="space-y-2">${playersList}</div>
        <div class="text-center mt-3">
          <span class="text-purple-200 text-xs">👁️ Tap to view details</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render history detail view
 * Uses the unified gameView component in review mode
 * @returns {string} HTML string
 */
export function historyDetailView() {
  const game = S.selectedHistoryGame;
  if (!game) return '';

  // Use the unified gameView component in review mode
  return gameView({
    mode: 'review',
    game: game,
    playerIndex: S.historyDetailPlayer
  });
}
