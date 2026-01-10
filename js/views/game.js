/**
 * Game View
 * Main game screen with scoring (supports both active gameplay and history review)
 */

import { S } from '../state.js';
import { UPPER, LOWER } from '../constants.js';
import { upTot, upBonus, loTot, grand, getPossibleScores } from '../utils/scoring.js';
import { color, escapeHtml, formatDate, formatTime } from '../utils/helpers.js';
import { playerCarousel } from './components/playerCard.js';
import { diceArea } from './components/diceArea.js';
import { picker } from './components/picker.js';
import { modal } from './components/modal.js';
import {
  upperScoreRow, lowerScoreRow,
  upperScoreRowPlay, lowerScoreRowPlay,
  readOnlyScoreRow
} from './components/scoreRow.js';
import { historyStandings } from './components/standings.js';

/**
 * Render the game view
 * @param {Object} options - Options for rendering
 * @param {string} options.mode - 'active' or 'review'
 * @param {Object} options.game - Game data (for review mode)
 * @param {number} options.playerIndex - Current player index (for review mode)
 * @returns {string} HTML string
 */
export function gameView(options = {}) {
  const mode = options.mode || 'active';
  const isReviewMode = mode === 'review';

  if (isReviewMode) {
    return gameViewReview(options.game, options.playerIndex);
  }

  // Active game mode (original logic)
  const currentPlayer = S.game[S.cur];
  const scores = currentPlayer.scores;
  const isPlayMode = S.mode === 'play';
  const possibleScores = isPlayMode && S.rollCount > 0 ? getPossibleScores(S.dice) : {};
  const canSelectScore = isPlayMode && S.rollCount > 0 && !S.rolling;

  // Check if sections should be shown (for blitz mode filtering)
  const hasUpperCategories = !S.isBlitzMode || UPPER.some(c => S.blitzCategories.includes(c.id));
  const hasLowerCategories = !S.isBlitzMode || LOWER.some(c => S.blitzCategories.includes(c.id));

  return `
    <div class="game-container ${S.isBlitzMode ? 'blitz-mode' : ''}">
      <div class="game-sticky-header">
        ${gameHeader(isPlayMode)}
        ${playerCarousel(S.game, S.cur)}
      </div>
      <div class="p-3" style="max-width:28rem;margin:0 auto">
        ${diceArea()}
        ${S.bonusJustClaimed && !isPlayMode ? bonusReminderBanner() : ''}
        ${hasUpperCategories ? upperSection(scores, isPlayMode, possibleScores, canSelectScore) : ''}
        ${hasLowerCategories ? lowerSection(scores, isPlayMode, possibleScores, canSelectScore) : ''}
      </div>
    </div>
    ${picker()}
    ${S.finishModal ? finishConfirmModal() : ''}
    ${S.earlyFinishModal ? earlyFinishModal() : ''}
    ${S.playerDetailsModal ? playerDetailsModal(currentPlayer) : ''}
  `;
}

/**
 * Render game view in review mode (for history)
 * @param {Object} game - Game data
 * @param {number} playerIndex - Current player index (unused, kept for compatibility)
 * @returns {string} HTML string
 */
function gameViewReview(game, playerIndex) {
  const players = game.players;
  const duration = game.dur ? ` • ${game.dur} minutes` : '';

  // Render all players' scorecards
  const allPlayersScores = players.map((player, index) => {
    const playerColor = color(player.pid);
    const scores = player.scores;

    return `
      <div class="mb-6" style="scroll-margin-top: 120px;" id="player-${index}">
        <div class="card p-4 mb-3" style="border-left:4px solid ${playerColor}">
          <h2 class="font-black text-2xl" style="color:${playerColor}">${escapeHtml(player.name)}</h2>
          <p class="text-gray-500 text-sm mt-1">Final Score: ${player.total}</p>
        </div>

        ${upperSection(scores, 'review')}
        ${lowerSection(scores, 'review')}

        <div class="total-gradient text-white rounded-2xl shadow-lg p-5 mb-4">
          <div class="flex justify-between items-center">
            <div>
              <p style="opacity:0.7" class="text-sm">Grand Total</p>
              <p class="text-4xl font-black">${player.total}</p>
            </div>
            <div class="text-sm" style="text-align:right;opacity:0.7">
              <p>Upper: ${upTot(scores)} + ${upBonus(scores)}</p>
              <p>Lower: ${loTot(scores)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('<div class="divider my-6" style="border-top:2px dashed var(--border);opacity:0.3"></div>');

  // Standings
  const sortedPlayers = [...players].sort((a, b) => b.total - a.total);
  const maxScore = sortedPlayers[0].total;
  const standingsHtml = historyStandings(sortedPlayers, maxScore);

  return `
    <div class="game-container">
      <div class="game-sticky-header">
        ${reviewHeader()}
      </div>

      <div class="p-3" style="max-width:28rem;margin:0 auto">
        <div class="glass rounded-xl p-3 mb-4 text-center">
          <p class="text-white text-sm font-medium">
            ${formatDate(game.date)} • ${formatTime(game.date)}${duration}
          </p>
        </div>

        ${allPlayersScores}

        <div class="card p-4 mt-6">
          <h3 class="font-bold mb-4 text-gray-800">📊 Final Standings</h3>
          ${standingsHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Create game header
 */
function gameHeader(isPlayMode) {
  let title = isPlayMode ? '🎲 SCHNITZEL' : '📝 SCHNITZEL';
  if (S.isBlitzMode) {
    title = '⚡ BLITZ MODE';
  }

  return `
    <div class="header-gradient text-white p-3">
      <div class="flex justify-between items-center" style="max-width:28rem;margin:0 auto">
        <button class="btn-text text-white text-lg font-medium" onclick="pauseG()">← Back</button>
        <h1 class="font-black text-lg">${title}</h1>
        <button class="btn btn-small btn-green" onclick="finishG()">Finish ✓</button>
      </div>
    </div>
  `;
}

/**
 * Create upper section card
 * @param {Object} scores - Player scores
 * @param {boolean|string} isPlayMode - Play mode flag or mode string ('review')
 * @param {Object} possibleScores - Possible scores for current dice
 * @param {boolean} canSelectScore - Whether player can select a score
 * @returns {string} HTML string
 */
function upperSection(scores, isPlayMode, possibleScores, canSelectScore) {
  const isReviewMode = isPlayMode === 'review';

  // Filter categories for blitz mode (not applicable in review mode)
  const categories = (!isReviewMode && S.isBlitzMode)
    ? UPPER.filter(c => S.blitzCategories.includes(c.id))
    : UPPER;

  const rows = categories.map(c => {
    if (isReviewMode) {
      return readOnlyScoreRow(c.name, scores[c.id], 'score-filled-blue');
    } else if (isPlayMode) {
      return upperScoreRowPlay(c, scores[c.id], possibleScores[c.id], canSelectScore && scores[c.id] === null);
    } else {
      return upperScoreRow(c, scores[c.id]);
    }
  }).join('');

  const bonusClass = upBonus(scores) ? 'text-green-600' : 'text-gray-400';
  const bonusText = upBonus(scores) ? '+35 ✓' : '0';
  const upperTotal = upTot(scores);
  const bonusAchieved = upperTotal >= 63;

  // Disable bonus display in blitz mode (not in review mode)
  const showBonus = isReviewMode || !S.isBlitzMode;

  // Different header styling for review mode
  const headerContent = isReviewMode
    ? `<h2 class="font-black text-sm uppercase tracking-wide">Upper Section</h2>
       <span class="text-sm px-2 py-1 rounded-full ${bonusAchieved ? 'glass" style="background:var(--link);color:var(--bg)' : 'glass'}">
         ${upperTotal}/63
       </span>`
    : `<h2 class="font-black text-sm uppercase tracking-wide">Upper Section</h2>
       <span class="font-black text-lg ${bonusAchieved ? 'opacity-100' : 'opacity-75'}">${upperTotal}/63</span>`;

  return `
    <div class="card score-section-card">
      <div class="flex items-center justify-between px-4 py-3 upper-gradient text-white">
        ${headerContent}
      </div>
      ${rows}
      ${showBonus ? `
        <div class="flex items-center justify-between px-4 py-3"
             style="background:var(--surface2);border-top:1px solid var(--border)">
          <span class="font-bold text-blue-600">Upper Bonus</span>
          <span class="font-black text-xl ${bonusClass}">${bonusText}</span>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Create lower section card
 * @param {Object} scores - Player scores
 * @param {boolean|string} isPlayMode - Play mode flag or mode string ('review')
 * @param {Object} possibleScores - Possible scores for current dice
 * @param {boolean} canSelectScore - Whether player can select a score
 * @returns {string} HTML string
 */
function lowerSection(scores, isPlayMode, possibleScores, canSelectScore) {
  const isReviewMode = isPlayMode === 'review';

  // Filter categories for blitz mode (not applicable in review mode)
  const categories = (!isReviewMode && S.isBlitzMode)
    ? LOWER.filter(c => S.blitzCategories.includes(c.id))
    : LOWER;

  const rows = categories.map(c => {
    if (isReviewMode) {
      return readOnlyScoreRow(c.name, scores[c.id], 'score-filled-purple');
    } else if (isPlayMode) {
      return lowerScoreRowPlay(c, scores[c.id], possibleScores[c.id], canSelectScore && scores[c.id] === null);
    } else {
      return lowerScoreRow(c, scores[c.id]);
    }
  }).join('');

  // Disable Yahtzee bonus display in blitz mode (not in review mode)
  const hasYahtzee = isReviewMode || !S.isBlitzMode;

  const yahtzeeBonus = hasYahtzee
    ? (isReviewMode
      ? `<div class="flex items-center justify-between px-4 py-3"
             style="background:var(--surface2);border-top:1px solid var(--border)">
          <div>
            <span class="font-bold text-yellow-600">Yahtzee Bonus</span>
            <span class="text-yellow-600 text-xs ml-2">+100 each</span>
          </div>
          <span class="font-black text-xl text-yellow-600">+${scores.bonus || 0}</span>
         </div>`
      : (isPlayMode
        ? `<div class="flex items-center justify-between px-4 py-3 bg-yellow-50">
            <div>
              <span class="font-bold text-yellow-800">Yahtzee Bonus</span>
              <span class="text-yellow-600 text-xs ml-2">+100 each</span>
            </div>
            <span class="font-black text-xl text-yellow-600">+${scores.bonus}</span>
           </div>`
        : `<div class="flex items-center justify-between px-4 py-3 bg-yellow-50">
            <div>
              <span class="font-bold text-yellow-800">Yahtzee Bonus</span>
              <span class="text-yellow-600 text-xs ml-2">+100 each</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-black text-xl text-yellow-600">+${scores.bonus}</span>
              <button class="btn btn-small ${scores.yahtzee === 50 ? 'btn-yellow' : 'btn-gray-dark'} font-bold"
                      onclick="addBonus()" ${scores.yahtzee !== 50 ? 'disabled' : ''}>+100</button>
            </div>
           </div>`))
    : '';

  const lowerTotal = loTot(scores);

  return `
    <div class="card score-section-card" style="margin-top: 1.5rem;">
      <div class="flex items-center justify-between px-4 py-3 lower-gradient text-white">
        <h2 class="font-black text-sm uppercase tracking-wide">Lower Section</h2>
        <span class="font-black text-lg">${lowerTotal}</span>
      </div>
      ${rows}
      ${yahtzeeBonus}
    </div>
  `;
}

/**
 * Create review header
 */
function reviewHeader() {
  return `
    <div class="header-gradient text-white p-3">
      <div class="flex justify-between items-center" style="max-width:28rem;margin:0 auto">
        <button class="btn-text text-white text-lg font-medium" onclick="closeHistoryDetail()">← Back</button>
        <h1 class="font-black text-lg">📖 GAME REVIEW</h1>
        <div class="text-xs" style="opacity:0.8">Read Only</div>
      </div>
    </div>
  `;
}

/**
 * Create finish confirmation modal
 */
function finishConfirmModal() {
  return modal(`
    <div class="text-center mb-4">
      <div class="text-5xl mb-3">🎉</div>
      <h3 class="text-2xl font-black text-gray-800 mb-2">Game Complete!</h3>
      <p class="text-gray-600">All scores have been entered.</p>
    </div>
    <div class="flex flex-col gap-3">
      <button class="btn btn-green font-bold py-4 px-4 rounded-xl w-full text-lg" onclick="confirmFinish()">
        🏆 Reveal Winners!
      </button>
      <button class="btn btn-gray font-medium py-3 px-4 rounded-xl w-full" onclick="S.finishModal=false;R()">
        Keep Playing
      </button>
    </div>
  `, 'event.stopPropagation()');
}

/**
 * Create early finish warning modal
 */
function earlyFinishModal() {
  const emptyCount = S.game.reduce((sum, p) => {
    const scores = p.scores;
    return sum + Object.keys(scores).filter(k => k !== 'bonus' && scores[k] === null).length;
  }, 0);

  return modal(`
    <div class="text-center mb-4">
      <div class="text-5xl mb-3">⚠️</div>
      <h3 class="text-2xl font-black text-gray-800 mb-2">Game Not Complete</h3>
      <p class="text-gray-600 mb-2">
        There are still <span class="font-bold text-red-600">${emptyCount} empty scores</span>.
      </p>
      <p class="text-gray-500 text-sm">Are you sure you want to finish early?</p>
    </div>
    <div class="flex flex-col gap-3">
      <button class="btn btn-orange font-bold py-4 px-4 rounded-xl w-full text-lg" onclick="confirmEarlyFinish()">
        Finish Anyway
      </button>
      <button class="btn btn-gray font-medium py-3 px-4 rounded-xl w-full" onclick="S.earlyFinishModal=false;R()">
        Keep Playing
      </button>
    </div>
  `, 'event.stopPropagation()');
}

/**
 * Create player details modal
 */
function playerDetailsModal(player) {
  const scores = player.scores;
  const upperTotal = upTot(scores);
  const upperBonusVal = upBonus(scores);
  const lowerTotal = loTot(scores);
  const grandTotal = grand(scores);
  const filledScores = Object.keys(scores).filter(k => k !== 'bonus' && scores[k] !== null).length;
  const totalScores = UPPER.length + LOWER.length;
  const playerColor = color(player.id);

  return modal(`
    <button class="btn-text text-white text-sm" style="position:absolute;top:1rem;right:1rem;opacity:0.8"
            onclick="S.playerDetailsModal=false;R()">✕</button>
    <div class="text-center mb-6">
      <h3 class="text-3xl font-black mb-2">${escapeHtml(player.name)}</h3>
      <p class="text-white" style="opacity:0.8">Player Details</p>
    </div>
    <div class="flex flex-col gap-4"
         style="background:rgba(255,255,255,0.1);border-radius:1rem;padding:1.5rem;backdrop-filter:blur(10px)">
      <div class="flex justify-between items-center">
        <span class="text-white" style="opacity:0.9">Grand Total</span>
        <span class="text-4xl font-black">${grandTotal}</span>
      </div>
      <div class="divider" style="background:rgba(255,255,255,0.2)"></div>
      <div class="flex justify-between items-center">
        <span class="text-white" style="opacity:0.9">Upper Section</span>
        <span class="text-2xl font-bold">${upperTotal}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-white" style="opacity:0.9;padding-left:1rem">Base Score</span>
        <span class="text-xl">${upperTotal}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-white" style="opacity:0.9;padding-left:1rem">Bonus</span>
        <span class="text-xl">${upperBonusVal ? '+35 ✓' : '0'}</span>
      </div>
      <div class="divider" style="background:rgba(255,255,255,0.2)"></div>
      <div class="flex justify-between items-center">
        <span class="text-white" style="opacity:0.9">Lower Section</span>
        <span class="text-2xl font-bold">${lowerTotal}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-white" style="opacity:0.9;padding-left:1rem">Yahtzee Bonus</span>
        <span class="text-xl">+${scores.bonus || 0}</span>
      </div>
      <div class="divider" style="background:rgba(255,255,255,0.2)"></div>
      <div class="flex justify-between items-center">
        <span class="text-white" style="opacity:0.9">Progress</span>
        <span class="text-xl font-bold">${filledScores}/${totalScores}</span>
      </div>
    </div>
  `, 'S.playerDetailsModal=false;R()', '',
    `background:linear-gradient(135deg, ${playerColor} 0%, ${playerColor}dd 100%);color:white;border:none`);
}

/**
 * Create bonus reminder banner for Score Mode
 * @returns {string} HTML string
 */
function bonusReminderBanner() {
  return `
    <div style="margin: 1rem 0 1rem 0; padding: 1rem; border-radius: 0.75rem; text-align: center;
                background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
                border: 2px solid #FBBF24; box-shadow: 0 4px 20px rgba(251, 191, 36, 0.4);
                animation: pulse 1.5s ease-in-out infinite;">
      <div style="font-size: 1.25rem; font-weight: 800; color: #78350F; margin-bottom: 0.25rem;">
        ✅ Bonus Claimed! +100
      </div>
      <div style="font-size: 0.875rem; color: #92400E; font-weight: 600;">
        ⬇️ Now score your roll in any category below ⬇️
      </div>
      <div style="font-size: 0.75rem; color: #92400E; opacity: 0.8; margin-top: 0.25rem;">
        (Use as joker: Chance, 3/4 of a kind, etc.)
      </div>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
    </style>
  `;
}
