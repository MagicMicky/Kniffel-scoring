/**
 * Dice Area Component
 * Renders the dice rolling area for play mode
 */

import { S } from '../../state.js';
import { dieFace } from '../../services/dice.js';
import { calcScore } from '../../utils/scoring.js';

/**
 * Create the dice area component
 * @returns {string} HTML string
 */
export function diceArea() {
  if (S.mode !== 'play') return '';

  if (!S.turnStarted) {
    const blitzHint = S.isBlitzMode
      ? '<p class="text-yellow-300 text-xs mb-2" style="font-weight:600">⚡ Blitz Mode: 2 rolls, 20 seconds!</p>'
      : '';
    return `
      <div class="dice-area">
        <div class="text-center py-4">
          <p class="text-white text-lg font-bold mb-2">Ready to roll?</p>
          ${blitzHint}
          <p class="text-white text-xs mb-4" style="opacity:0.7">Tap the button when you're ready</p>
          <button class="roll-btn" onclick="startTurn()">
            👆 Start My Turn
          </button>
        </div>
      </div>
    `;
  }

  const diceHtml = S.dice.map((d, i) => {
    const heldClass = S.held[i] ? 'held' : '';
    const rollingClass = S.rolling && !S.held[i] ? 'rolling' : '';
    return `
      <div class="die ${heldClass} ${rollingClass}" onclick="toggleHold(${i})">
        ${dieFace(d)}
      </div>
    `;
  }).join('');

  const maxRolls = S.isBlitzMode ? 2 : 3;
  const rollBtnText = S.rollCount === 0
    ? '🎲 Roll Dice!'
    : S.rollCount >= maxRolls
      ? 'Select a score below'
      : `🎲 Roll Again (${S.rollCount}/${maxRolls})`;

  const rollBtnDisabled = S.rollCount >= maxRolls || S.rolling ? 'disabled' : '';

  const rollCountText = S.rollCount === 0 ? 'Roll to start!' : `Roll ${S.rollCount} of ${maxRolls}`;
  const shakeHint = S.shakeEnabled ? '📳 Shake enabled' : 'Tap button to roll';

  // Check if bonus Yahtzee is rolled
  const currentPlayer = S.game[S.cur];
  const isBonusYahtzee = S.rollCount > 0 &&
                         calcScore(S.dice, 'yahtzee') === 50 &&
                         currentPlayer.scores.yahtzee === 50;

  // Timer display for blitz mode
  const timerDisplay = S.isBlitzMode ? blitzTimerDisplay() : '';

  return `
    <div class="dice-area">
      ${timerDisplay}
      <div class="roll-info">
        <span class="roll-count">${rollCountText}</span>
        <span class="shake-hint">${shakeHint}</span>
      </div>
      <div class="dice-container">
        ${diceHtml}
      </div>
      ${isBonusYahtzee ? bonusYahtzeeBanner() : ''}
      <button class="roll-btn" onclick="rollDice()" ${rollBtnDisabled}>
        ${rollBtnText}
      </button>
      ${S.rollCount > 0 && !S.rolling ? '<p class="text-center text-xs" style="color:rgba(255,255,255,0.6);margin-top:0.5rem">Tap dice to hold/release</p>' : ''}
    </div>
  `;
}

/**
 * Create blitz mode timer display
 * @returns {string} HTML string
 */
function blitzTimerDisplay() {
  const timeRemaining = Math.ceil(S.turnTimeRemaining);
  const percentage = (S.turnTimeRemaining / 20) * 100;
  const isWarning = timeRemaining <= 10;
  const warningClass = isWarning ? 'timer-warning' : '';
  const speedBonusActive = S.turnTimeRemaining >= 15;
  const speedBonusClass = speedBonusActive ? 'speed-bonus-active' : '';

  return `
    <div class="blitz-timer ${warningClass}">
      <div class="timer-header">
        <span class="timer-label">⚡ Time Remaining</span>
        <span class="timer-value ${isWarning ? 'text-red-400' : 'text-white'}">${timeRemaining}s</span>
      </div>
      ${speedBonusActive ? '<div class="speed-bonus-indicator">⚡ +5 speed bonus active!</div>' : ''}
      <div class="timer-bar-container">
        <div class="timer-bar ${speedBonusClass}" style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
}

/**
 * Create bonus Yahtzee informational banner
 * @returns {string} HTML string
 */
function bonusYahtzeeBanner() {
  return `
    <div style="margin: 1rem 0; padding: 1rem; border-radius: 0.75rem; text-align: center;
                background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
                border: 2px solid #FBBF24; box-shadow: 0 4px 20px rgba(251, 191, 36, 0.4);
                animation: pulse 1.5s ease-in-out infinite;">
      <div style="font-size: 1.5rem; font-weight: 800; color: #78350F; margin-bottom: 0.25rem;">
        🎉 BONUS YAHTZEE! 🎉
      </div>
      <div style="font-size: 0.875rem; color: #92400E; font-weight: 600; margin-bottom: 0.5rem;">
        +100 points added automatically!
      </div>
      <div style="font-size: 0.75rem; color: #92400E; opacity: 0.9;">
        ⬇️ Now select where to score these dice below ⬇️
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
