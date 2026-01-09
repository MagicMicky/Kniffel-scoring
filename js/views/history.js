/**
 * History View
 * Game history list and detail views
 */

import { S } from '../state.js';
import { UPPER, LOWER } from '../constants.js';
import { upTot, upBonus, loTot } from '../utils/scoring.js';
import { color, formatDate, formatTime, escapeHtml } from '../utils/helpers.js';
import { readOnlyScoreRow } from './components/scoreRow.js';
import { historyStandings } from './components/standings.js';

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

    return `
      <div class="glass rounded-2xl p-4" style="cursor:pointer;transition:all 0.15s"
           onclick="viewHistoryGame(${game.id})"
           onmouseover="this.style.background='rgba(255,255,255,0.15)'"
           onmouseout="this.style.background='rgba(255,255,255,0.1)'">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="font-bold text-white">${formatDate(game.date)}</p>
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
 * @returns {string} HTML string
 */
export function historyDetailView() {
  const game = S.selectedHistoryGame;
  if (!game) return '';

  const players = game.players;
  const currentPlayer = players[S.historyDetailPlayer];
  const scores = currentPlayer.scores;

  // Player tabs
  const tabs = players.map((p, i) => {
    const playerColor = color(p.pid);
    const isActive = i === S.historyDetailPlayer;
    const activeStyle = isActive ? `background:${playerColor}` : '';

    return `
      <button class="player-tab flex-shrink-0 ${isActive ? 'player-tab-active' : 'player-tab-inactive'}"
              style="${activeStyle}" onclick="switchHistoryPlayer(${i})">
        ${escapeHtml(p.name)}: ${p.total}
      </button>
    `;
  }).join('');

  // Upper section rows
  const upperRows = UPPER.map(c => readOnlyScoreRow(c.name, scores[c.id], 'score-filled-blue')).join('');

  // Lower section rows
  const lowerRows = LOWER.map(c => readOnlyScoreRow(c.name, scores[c.id], 'score-filled-purple')).join('');

  // Standings
  const sortedPlayers = [...players].sort((a, b) => b.total - a.total);
  const maxScore = sortedPlayers[0].total;
  const standingsHtml = historyStandings(sortedPlayers, maxScore);

  const duration = game.dur ? ` • ${game.dur} minutes` : '';
  const playerColor = color(currentPlayer.pid);

  return `
    <div style="min-height:100vh;background:var(--bg);padding-bottom:6rem">
      <div class="header-gradient text-white p-3 sticky">
        <div class="flex justify-between items-center" style="max-width:28rem;margin:0 auto">
          <button class="btn-text text-white text-lg font-medium" onclick="closeHistoryDetail()">← Back</button>
          <h1 class="font-black text-lg">📖 GAME REVIEW</h1>
          <div class="text-xs" style="opacity:0.8">Read Only</div>
        </div>
      </div>

      <div class="sticky-tabs" style="background:var(--surface);box-shadow:0 4px 6px -1px rgba(0,0,0,0.3);border-bottom:1px solid var(--border)">
        <div class="flex overflow-x-auto py-2 px-2 gap-2" style="max-width:28rem;margin:0 auto">
          ${tabs}
        </div>
      </div>

      <div class="p-3" style="max-width:28rem;margin:0 auto">
        <div class="card p-4 mb-4" style="border-left:4px solid ${playerColor}">
          <h2 class="font-black text-2xl" style="color:${playerColor}">${escapeHtml(currentPlayer.name)}</h2>
          <p class="text-gray-500 text-sm mt-1">Final Score: ${currentPlayer.total}</p>
        </div>

        <div class="glass rounded-xl p-3 mb-4 text-center">
          <p class="text-white text-sm font-medium">
            ${formatDate(game.date)} • ${formatTime(game.date)}${duration}
          </p>
        </div>

        <div class="card mb-4">
          <div class="upper-gradient text-white px-4 py-3 flex justify-between items-center">
            <span class="font-bold">Upper Section</span>
            <span class="text-sm px-2 py-1 rounded-full ${upTot(scores) >= 63 ? 'glass" style="background:var(--link);color:var(--bg)' : 'glass'}">
              ${upTot(scores)}/63
            </span>
          </div>
          ${upperRows}
          <div class="flex items-center justify-between px-4 py-3"
               style="background:var(--surface2);border-top:1px solid var(--border)">
            <span class="font-bold text-blue-600">Upper Bonus</span>
            <span class="font-black text-xl ${upBonus(scores) ? 'text-green-600' : 'text-gray-400'}">
              ${upBonus(scores) ? '+35 ✓' : '0'}
            </span>
          </div>
        </div>

        <div class="card mb-4">
          <div class="lower-gradient text-white px-4 py-3 font-bold">Lower Section</div>
          ${lowerRows}
          <div class="flex items-center justify-between px-4 py-3"
               style="background:var(--surface2);border-top:1px solid var(--border)">
            <div>
              <span class="font-bold text-yellow-600">Yahtzee Bonus</span>
              <span class="text-yellow-600 text-xs ml-2">+100 each</span>
            </div>
            <span class="font-black text-xl text-yellow-600">+${scores.bonus || 0}</span>
          </div>
        </div>

        <div class="total-gradient text-white rounded-2xl shadow-lg p-5 mb-4">
          <div class="flex justify-between items-center">
            <div>
              <p style="opacity:0.7" class="text-sm">Grand Total</p>
              <p class="text-4xl font-black">${currentPlayer.total}</p>
            </div>
            <div class="text-sm" style="text-align:right;opacity:0.7">
              <p>Upper: ${upTot(scores)} + ${upBonus(scores)}</p>
              <p>Lower: ${loTot(scores)}</p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <h3 class="font-bold mb-4 text-gray-800">📊 Final Standings</h3>
          ${standingsHtml}
        </div>
      </div>
    </div>
  `;
}
