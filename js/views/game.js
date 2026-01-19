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
      ${gameHeader(isPlayMode)}
      <div style="position:sticky;top:calc(52px);z-index:99;background:var(--bg-primary);border-bottom:2px solid var(--border-primary);box-shadow:0 4px 12px rgba(0,0,0,0.4)">
        ${playerCarousel(S.game, S.cur)}
      </div>
      <div style="padding:var(--space-md);max-width:28rem;margin:0 auto">
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
 * Get game mode badge info
 * @param {Object} game - Game record
 * @returns {Object} Badge info with icon, label, and cssClass
 */
function getModeBadge(game) {
  // Check if mode is not set (undefined or null)
  if (!game.mode && game.isBlitzMode !== true && game.isBlitzMode !== false) {
    return {
      icon: '❓',
      label: 'Unknown Mode',
      cssClass: 'mode-badge-unknown'
    };
  }

  if (game.isBlitzMode) {
    return {
      icon: '⚡',
      label: 'Blitz Mode',
      cssClass: 'mode-badge-blitz'
    };
  } else if (game.mode === 'play') {
    return {
      icon: '🎲',
      label: 'Virtual Dice',
      cssClass: 'mode-badge-play'
    };
  } else {
    return {
      icon: '📝',
      label: 'Score Mode',
      cssClass: 'mode-badge-score'
    };
  }
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
  const modeBadge = getModeBadge(game);

  // Render all players' scorecards
  const allPlayersScores = players.map((player, index) => {
    const playerColor = color(player.pid);
    const scores = player.scores;

    return `
      <div style="margin-bottom:var(--space-xl);scroll-margin-top:120px;" id="player-${index}">
        <div class="box" style="border-left:4px solid ${playerColor};margin-bottom:var(--space-md)">
          <h2 style="color:${playerColor};font-family:var(--font-display);font-size:var(--font-size-h3);font-weight:var(--font-weight-black);margin-bottom:var(--space-xs)">${escapeHtml(player.name)}</h2>
          <p style="color:var(--muted);font-size:var(--font-size-small)">Final Score: ${player.total}</p>
        </div>

        ${upperSection(scores, 'review')}
        ${lowerSection(scores, 'review')}

        <div class="total-card">
          <div class="label">Grand Total</div>
          <div class="value">${player.total}</div>
          <div class="breakdown">
            <span>Upper: ${upTot(scores)} + ${upBonus(scores)}</span>
            <span>Lower: ${loTot(scores)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('<div class="accent-line" style="margin:var(--space-xl) 0"></div>');

  // Standings
  const sortedPlayers = [...players].sort((a, b) => b.total - a.total);
  const maxScore = sortedPlayers[0].total;
  const standingsHtml = historyStandings(sortedPlayers, maxScore);

  return `
    <div class="game-container">
      <div class="game-sticky-header">
        ${reviewHeader()}
      </div>

      <div style="padding:var(--space-md);max-width:28rem;margin:0 auto">
        <div class="session-info" style="margin-bottom:var(--space-md);flex-wrap:wrap;justify-content:center;gap:var(--space-sm)">
          <span class="session-value">
            ${formatDate(game.date)} • ${formatTime(game.date)}${duration}
          </span>
          <span class="mode-badge ${modeBadge.cssClass}">
            ${modeBadge.icon} ${modeBadge.label}
          </span>
        </div>

        ${allPlayersScores}

        <div class="card" style="margin-top:var(--space-xl)">
          <h3 class="section-title">📊 Final Standings</h3>
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
  return `
    <div class="game-header">
      <div class="game-header-content">
        <button class="btn-text" onclick="pauseG()">← Back</button>
        <h1>SCHNITZEL</h1>
        <button class="btn-sm btn-primary" onclick="finishG()">Finish</button>
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
      return readOnlyScoreRow(c.name, scores[c.id], 'score-filled-blue', c.id, scores);
    } else if (isPlayMode) {
      return upperScoreRowPlay(c, scores[c.id], possibleScores[c.id], canSelectScore && scores[c.id] === null, scores);
    } else {
      return upperScoreRow(c, scores[c.id]);
    }
  }).join('');

  const bonusValue = upBonus(scores);
  const bonusText = bonusValue ? '+35' : '0';
  const bonusClass = bonusValue ? 'achieved' : 'not-achieved';
  const upperTotal = upTot(scores);
  const bonusAchieved = upperTotal >= 63;
  const progressClass = bonusAchieved ? 'complete' : '';

  // Disable bonus display in blitz mode (not in review mode)
  const showBonus = isReviewMode || !S.isBlitzMode;

  return `
    <div class="card">
      <div class="score-section-header">
        <h2>Upper Section</h2>
        <span class="section-progress ${progressClass}">${upperTotal}/63</span>
      </div>
      ${rows}
      ${showBonus ? `
        <div class="score-section-footer">
          <span class="label">Upper Bonus</span>
          <span class="value ${bonusClass}">${bonusText}</span>
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
      return readOnlyScoreRow(c.name, scores[c.id], 'score-filled-purple', c.id, scores);
    } else if (isPlayMode) {
      return lowerScoreRowPlay(c, scores[c.id], possibleScores[c.id], canSelectScore && scores[c.id] === null, scores);
    } else {
      return lowerScoreRow(c, scores[c.id]);
    }
  }).join('');

  // Disable Yahtzee bonus display in blitz mode (not in review mode)
  const hasYahtzee = isReviewMode || !S.isBlitzMode;
  const bonusAmount = scores.bonus || 0;

  const yahtzeeBonus = hasYahtzee
    ? (isReviewMode || isPlayMode
      ? `<div class="score-section-footer">
          <div>
            <span class="label">Yahtzee Bonus</span>
            <span class="label" style="font-size:0.75rem;opacity:0.7;margin-left:0.5rem">+100 each</span>
          </div>
          <span class="value">+${bonusAmount}</span>
         </div>`
      : `<div class="score-section-footer">
          <div>
            <span class="label">Yahtzee Bonus</span>
            <span class="label" style="font-size:0.75rem;opacity:0.7;margin-left:0.5rem">+100 each</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <span class="value">+${bonusAmount}</span>
            <button class="btn-sm ${scores.yahtzee === 50 ? 'btn-primary' : 'btn-secondary'}"
                    onclick="addBonus()" ${scores.yahtzee !== 50 ? 'disabled' : ''}>+100</button>
          </div>
         </div>`)
    : '';

  const lowerTotal = loTot(scores);

  return `
    <div class="card" style="margin-top: var(--space-lg);">
      <div class="score-section-header">
        <h2>Lower Section</h2>
        <span class="section-progress">${lowerTotal}</span>
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
    <div class="game-header">
      <div class="game-header-content">
        <button class="btn-text" onclick="closeHistoryDetail()">← Back</button>
        <h1>Review</h1>
        <div style="width:4rem"></div>
      </div>
    </div>
  `;
}

/**
 * Create finish confirmation modal
 */
function finishConfirmModal() {
  return modal(`
    <div class="text-center" style="margin-bottom:var(--space-lg)">
      <div style="font-size:4rem;margin-bottom:var(--space-md)">🎉</div>
      <h3 style="font-size:var(--font-size-h3);font-weight:var(--font-weight-black);color:var(--text);margin-bottom:var(--space-xs);font-family:var(--font-body)">Game Complete!</h3>
      <p style="color:var(--text-secondary);font-family:var(--font-body)">All scores have been entered.</p>
    </div>
    <div class="flex flex-col gap-3">
      <button class="btn-primary w-full" onclick="confirmFinish()">
        🏆 Reveal Winners!
      </button>
      <button class="btn-secondary w-full" onclick="S.finishModal=false;R()">
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
    <div class="text-center" style="margin-bottom:var(--space-lg)">
      <div style="font-size:4rem;margin-bottom:var(--space-md)">⚠️</div>
      <h3 style="font-size:var(--font-size-h3);font-weight:var(--font-weight-black);color:var(--text);margin-bottom:var(--space-xs);font-family:var(--font-body)">Game Not Complete</h3>
      <p style="color:var(--text-secondary);margin-bottom:var(--space-xs);font-family:var(--font-body)">
        There are still <span style="font-weight:var(--font-weight-bold);color:var(--error)">${emptyCount} empty scores</span>.
      </p>
      <p style="color:var(--muted);font-size:var(--font-size-small);font-family:var(--font-body)">Are you sure you want to finish early?</p>
    </div>
    <div class="flex flex-col gap-3">
      <button class="btn-primary w-full" onclick="confirmEarlyFinish()">
        Finish Anyway
      </button>
      <button class="btn-secondary w-full" onclick="S.earlyFinishModal=false;R()">
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
    <button class="btn-text" style="position:absolute;top:var(--space-md);right:var(--space-md)"
            onclick="S.playerDetailsModal=false;R()">✕</button>
    <div class="text-center" style="margin-bottom:var(--space-lg)">
      <h3 style="font-size:var(--font-size-h2);font-weight:var(--font-weight-black);color:var(--text);margin-bottom:var(--space-xs);font-family:var(--font-display)">${escapeHtml(player.name)}</h3>
      <p style="color:var(--text-secondary);font-family:var(--font-body)">Player Details</p>
    </div>
    <div class="box" style="padding:var(--space-lg)">
      <div class="flex justify-between items-center" style="margin-bottom:var(--space-md)">
        <span style="color:var(--text-secondary);font-family:var(--font-body)">Grand Total</span>
        <span style="font-size:var(--font-size-h2);font-weight:var(--font-weight-black);color:var(--gold-bright);font-family:var(--font-display);letter-spacing:var(--letter-spacing-tight)">${grandTotal}</span>
      </div>
      <div class="accent-line"></div>
      <div class="flex justify-between items-center" style="margin-bottom:var(--space-sm)">
        <span style="color:var(--text-secondary);font-family:var(--font-body)">Upper Section</span>
        <span style="font-size:var(--font-size-number-md);font-weight:var(--font-weight-bold);color:var(--gold-pale);font-family:var(--font-display)">${upperTotal}</span>
      </div>
      <div class="flex justify-between items-center" style="margin-bottom:var(--space-sm);padding-left:var(--space-md)">
        <span style="color:var(--muted);font-size:var(--font-size-small);font-family:var(--font-body)">Base Score</span>
        <span style="font-size:var(--font-size-body);color:var(--text-secondary);font-family:var(--font-display)">${upperTotal}</span>
      </div>
      <div class="flex justify-between items-center" style="margin-bottom:var(--space-md);padding-left:var(--space-md)">
        <span style="color:var(--muted);font-size:var(--font-size-small);font-family:var(--font-body)">Bonus</span>
        <span style="font-size:var(--font-size-body);color:var(--text-secondary);font-family:var(--font-display)">${upperBonusVal ? '+35 ✓' : '0'}</span>
      </div>
      <div class="accent-line"></div>
      <div class="flex justify-between items-center" style="margin-bottom:var(--space-sm)">
        <span style="color:var(--text-secondary);font-family:var(--font-body)">Lower Section</span>
        <span style="font-size:var(--font-size-number-md);font-weight:var(--font-weight-bold);color:var(--gold-pale);font-family:var(--font-display)">${lowerTotal}</span>
      </div>
      <div class="flex justify-between items-center" style="margin-bottom:var(--space-md);padding-left:var(--space-md)">
        <span style="color:var(--muted);font-size:var(--font-size-small);font-family:var(--font-body)">Yahtzee Bonus</span>
        <span style="font-size:var(--font-size-body);color:var(--text-secondary);font-family:var(--font-display)">+${scores.bonus || 0}</span>
      </div>
      <div class="accent-line"></div>
      <div class="flex justify-between items-center">
        <span style="color:var(--text-secondary);font-family:var(--font-body)">Progress</span>
        <span style="font-size:var(--font-size-number-sm);font-weight:var(--font-weight-bold);color:var(--gold-primary);font-family:var(--font-display)">${filledScores}/${totalScores}</span>
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
    <div class="card" style="margin: 1rem 0 1rem 0; padding: 1rem; text-align: center;
                background: linear-gradient(135deg, rgba(230, 184, 115, 0.3) 0%, rgba(218, 168, 94, 0.3) 100%);
                border: 2px solid var(--gold-primary); box-shadow: 0 4px 20px var(--focusRing);
                animation: pulse 1.5s ease-in-out infinite;">
      <div style="font-size: 1.25rem; font-weight: 800; color: var(--gold-bright); margin-bottom: 0.25rem;">
        ✅ Bonus Claimed! +100
      </div>
      <div style="font-size: 0.875rem; color: var(--text); font-weight: 600;">
        ⬇️ Now score your roll in any category below ⬇️
      </div>
      <div style="font-size: 0.75rem; color: var(--muted); margin-top: 0.25rem;">
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
