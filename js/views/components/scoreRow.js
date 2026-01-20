/**
 * Score Row Component
 * Renders individual score rows for upper and lower sections
 * REFACTORED: Now uses unified ScoreRow component from components/scoreComponents.js
 */

import { ScoreRow, ReadOnlyScoreRow } from '../../components/scoreComponents.js';
import { hasSpeedBonus } from '../../utils/storage.js';

/**
 * Create an upper section score row (Score Mode)
 * @param {Object} category - Category config {id, name, value}
 * @param {number|null} score - Current score value
 * @returns {string} HTML string
 */
export function upperScoreRow(category, score) {
  const possibleValues = [0, 1, 2, 3, 4, 5].map(n => n * category.value).join(',');
  const hasScore = score !== null;

  return ScoreRow({
    label: category.name,
    hint: `(${possibleValues})`,
    value: score,
    state: hasScore ? 'filled' : 'empty',
    variant: 'upper',
    showClear: hasScore,
    onClear: `clr('${category.id}')`,
    onSelect: `openUp('${category.id}',${category.value},'${category.name}')`
  }) + `<div class="divider"></div>`;
}

/**
 * Create a lower section score row (Score Mode)
 * @param {Object} category - Category config {id, name, type, fixed?, max?}
 * @param {number|null} score - Current score value
 * @returns {string} HTML string
 */
export function lowerScoreRow(category, score) {
  const rangeHint = category.type === 'fixed' ? `(0/${category.fixed})` : `(0-${category.max})`;
  const hasScore = score !== null;

  return ScoreRow({
    label: category.name,
    hint: rangeHint,
    value: score,
    state: hasScore ? 'filled' : 'empty',
    variant: 'lower',
    showClear: hasScore,
    onClear: `clr('${category.id}')`,
    onSelect: `openLo('${category.id}','${category.type}',${category.fixed || category.max},'${category.name}')`
  }) + `<div class="divider"></div>`;
}

/**
 * Create an upper section score row (Play Mode)
 * @param {Object} category - Category config
 * @param {number|null} currentScore - Current saved score
 * @param {number} possibleScore - Possible score with current dice
 * @param {boolean} canSelect - Whether player can select a score
 * @param {Object} scores - Player scores object (for checking speed bonus)
 * @returns {string} HTML string
 */
export function upperScoreRowPlay(category, currentScore, possibleScore, canSelect, scores) {
  if (currentScore !== null) {
    // Filled score
    const hasSB = scores && hasSpeedBonus(scores, category.id);
    const speedBonus = hasSB ? { amount: '', text: '⚡' } : null;

    return ScoreRow({
      label: category.name,
      value: currentScore,
      state: 'filled',
      variant: 'upper',
      showClear: true,
      speedBonus,
      onClear: `clr('${category.id}')`,
      onSelect: ''
    }) + `<div class="divider"></div>`;
  } else if (canSelect) {
    // Can select score
    const state = possibleScore > 0 ? 'available' : 'zero-only';

    return ScoreRow({
      label: category.name,
      value: possibleScore,
      state,
      variant: 'upper',
      showClear: false,
      onSelect: `selectPlayScore('${category.id}',${possibleScore})`
    }) + `<div class="divider"></div>`;
  } else {
    // Disabled (not current turn)
    return ScoreRow({
      label: category.name,
      value: null,
      state: 'empty',
      variant: 'upper',
      showClear: false,
      disabled: true
    }) + `<div class="divider"></div>`;
  }
}

/**
 * Create a lower section score row (Play Mode)
 * @param {Object} category - Category config
 * @param {number|null} currentScore - Current saved score
 * @param {number} possibleScore - Possible score with current dice
 * @param {boolean} canSelect - Whether player can select a score
 * @param {Object} scores - Player scores object (for checking speed bonus)
 * @returns {string} HTML string
 */
export function lowerScoreRowPlay(category, currentScore, possibleScore, canSelect, scores) {
  if (currentScore !== null) {
    // Filled score
    const hasSB = scores && hasSpeedBonus(scores, category.id);
    const speedBonus = hasSB ? { amount: '', text: '⚡' } : null;

    return ScoreRow({
      label: category.name,
      value: currentScore,
      state: 'filled',
      variant: 'lower',
      showClear: true,
      speedBonus,
      onClear: `clr('${category.id}')`,
      onSelect: ''
    }) + `<div class="divider"></div>`;
  } else if (canSelect) {
    // Can select score
    const state = possibleScore > 0 ? 'available' : 'zero-only';

    return ScoreRow({
      label: category.name,
      value: possibleScore,
      state,
      variant: 'lower',
      showClear: false,
      onSelect: `selectPlayScore('${category.id}',${possibleScore})`
    }) + `<div class="divider"></div>`;
  } else {
    // Disabled (not current turn)
    return ScoreRow({
      label: category.name,
      value: null,
      state: 'empty',
      variant: 'lower',
      showClear: false,
      disabled: true
    }) + `<div class="divider"></div>`;
  }
}

/**
 * Create a read-only score row (for history view)
 * @param {string} name - Category name
 * @param {number} score - Score value
 * @param {string} colorClass - CSS class for styling (kept for backward compatibility)
 * @param {string} categoryId - Category ID (optional, for speed bonus check)
 * @param {Object} scores - Player scores object (optional, for speed bonus check)
 * @returns {string} HTML string
 */
export function readOnlyScoreRow(name, score, colorClass, categoryId = null, scores = null) {
  const hasSB = categoryId && scores && hasSpeedBonus(scores, categoryId);
  const speedBonusIndicator = hasSB ? ' ⚡' : '';

  // For backward compatibility, we still output the old structure
  // TODO: Migrate to ReadOnlyScoreRow component in future refactoring
  return `
    <div class="flex items-center justify-between px-4 py-3">
      <span class="font-medium text-gray-800">${name}</span>
      <span class="score-btn ${colorClass}">${score !== null ? score : 0}${speedBonusIndicator}</span>
    </div>
    <div class="divider"></div>
  `;
}
