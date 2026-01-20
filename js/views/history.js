/**
 * History View
 * Game history list and detail views
 */

import { S } from '../state.js';
import { color, formatDate, formatTime, escapeHtml } from '../utils/helpers.js';
import { gameView } from './game.js';
import { PageHeader } from '../components/ui.js';

/**
 * Render history list view
 * @returns {string} HTML string
 */
export function historyListView() {
  const gamesList = S.history.length === 0
    ? noHistoryMessage()
    : historyGamesList();

  return `
    <div class="container container-fullheight p-md">
      ${PageHeader({
        title: '📜 History',
        backButton: 'navigateTo(\'setup\')'
      })}
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
  // Check if mode is not set (undefined or null)
  if (!game.mode && game.isBlitzMode !== true && game.isBlitzMode !== false) {
    return {
      icon: '❓',
      label: 'Unknown',
      cssClass: 'mode-badge-unknown',
      needsUpdate: true
    };
  }

  if (game.isBlitzMode) {
    return {
      icon: '⚡',
      label: 'Blitz',
      cssClass: 'mode-badge-blitz',
      needsUpdate: false
    };
  } else if (game.mode === 'play') {
    return {
      icon: '🎲',
      label: 'Play',
      cssClass: 'mode-badge-play',
      needsUpdate: false
    };
  } else {
    return {
      icon: '📝',
      label: 'Score',
      cssClass: 'mode-badge-score',
      needsUpdate: false
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
    const isEditing = S.editingGameMode === game.id;

    // Show mode selector if: unknown mode OR currently editing this game
    const showModeSelector = modeBadge.needsUpdate || isEditing;
    const modeSelector = showModeSelector ? `
      <div class="mt-3 p-3 rounded-xl" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1)" onclick="event.stopPropagation()">
        <p class="text-xs text-purple-200 mb-2 text-center">${modeBadge.needsUpdate ? '❓ Select' : '✏️ Change'} game mode:</p>
        <div class="flex gap-2 justify-center">
          <button class="mode-select-btn mode-badge-score" onclick="updateGameMode(${game.id}, 'score', false)">
            📝 Score
          </button>
          <button class="mode-select-btn mode-badge-play" onclick="updateGameMode(${game.id}, 'play', false)">
            🎲 Play
          </button>
          <button class="mode-select-btn mode-badge-blitz" onclick="updateGameMode(${game.id}, 'play', true)">
            ⚡ Blitz
          </button>
        </div>
      </div>
    ` : `
      <div class="text-center mt-3">
        <span class="text-purple-200 text-xs">👁️ Tap to view details</span>
      </div>
    `;

    return `
      <div class="glass rounded-2xl p-4" style="cursor:pointer;transition:all 0.15s"
           onclick="${showModeSelector ? '' : `viewHistoryGame(${game.id})`}"
           onmouseover="this.style.background='rgba(255,255,255,0.15)'"
           onmouseout="this.style.background='rgba(255,255,255,0.1)'">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="font-bold text-white">${formatDate(game.date)}</p>
              <span class="mode-badge ${modeBadge.cssClass}"
                    style="cursor:pointer;transition:opacity 0.2s"
                    onclick="event.stopPropagation();toggleModeEditor(${game.id})"
                    onmouseover="this.style.opacity='0.7'"
                    onmouseout="this.style.opacity='1'"
                    title="Click to ${isEditing ? 'cancel' : 'change mode'}">
                ${modeBadge.icon} ${modeBadge.label}
              </span>
            </div>
            <p class="text-sm text-purple-200">${formatTime(game.date)}${duration}</p>
          </div>
          <button class="delete-btn" onclick="event.stopPropagation();delH(${game.id})">🗑️</button>
        </div>
        <div class="space-y-2">${playersList}</div>
        ${modeSelector}
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
