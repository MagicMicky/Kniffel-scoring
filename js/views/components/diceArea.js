/**
 * Dice Area Component
 * Renders the dice rolling area for play mode
 */

import { S } from '../../state.js';
import { dieFace } from '../../services/dice.js';

/**
 * Create the dice area component
 * @returns {string} HTML string
 */
export function diceArea() {
  if (S.mode !== 'play') return '';

  if (!S.turnStarted) {
    return `
      <div class="dice-area">
        <div class="text-center py-4">
          <p class="text-white text-lg font-bold mb-2">Ready to roll?</p>
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

  const rollBtnText = S.rollCount === 0
    ? '🎲 Roll Dice!'
    : S.rollCount >= 3
      ? 'Select a score below'
      : `🎲 Roll Again (${S.rollCount}/3)`;

  const rollBtnDisabled = S.rollCount >= 3 || S.rolling ? 'disabled' : '';

  const rollCountText = S.rollCount === 0 ? 'Roll to start!' : `Roll ${S.rollCount} of 3`;
  const shakeHint = S.shakeEnabled ? '📳 Shake enabled' : 'Tap button to roll';

  return `
    <div class="dice-area">
      <div class="roll-info">
        <span class="roll-count">${rollCountText}</span>
        <span class="shake-hint">${shakeHint}</span>
      </div>
      <div class="dice-container">
        ${diceHtml}
      </div>
      <button class="roll-btn" onclick="rollDice()" ${rollBtnDisabled}>
        ${rollBtnText}
      </button>
      ${S.rollCount > 0 && !S.rolling ? '<p class="text-center text-xs" style="color:rgba(255,255,255,0.6);margin-top:0.5rem">Tap dice to hold/release</p>' : ''}
    </div>
  `;
}
