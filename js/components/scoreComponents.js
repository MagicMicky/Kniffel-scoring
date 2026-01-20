/**
 * Score Components
 * Unified score display components for all game modes
 */

import { escapeHtml } from '../utils/helpers.js';

/**
 * ScoreRow Component
 * Unified score row for all modes (score/play) and sections (upper/lower)
 * @param {Object} options
 * @param {string} options.label - Category name
 * @param {string} [options.hint=''] - Hint text (e.g., possible values, range)
 * @param {number|null} options.value - Current score value
 * @param {string} [options.state='empty'] - 'empty' | 'filled' | 'available' | 'zero-only'
 * @param {string} [options.variant='upper'] - 'upper' | 'lower' | 'bonus' | 'total'
 * @param {boolean} [options.showClear=true] - Show clear button when filled
 * @param {Object} [options.speedBonus=null] - { amount: number, text: string }
 * @param {string} [options.onClear=''] - Clear handler
 * @param {string} [options.onSelect=''] - Select handler
 * @param {boolean} [options.disabled=false] - Disabled state
 * @returns {string} HTML string
 */
export function ScoreRow({
  label,
  hint = '',
  value,
  state = 'empty',
  variant = 'upper',
  showClear = true,
  speedBonus = null,
  onClear = '',
  onSelect = '',
  disabled = false
}) {
  const hasScore = value !== null && value !== undefined;
  const displayValue = hasScore ? value : '—';

  // Determine button classes based on state and variant
  let btnClass = 'score-btn';

  if (state === 'filled') {
    btnClass = variant === 'upper' ? 'score-btn score-filled-blue' : 'score-btn score-filled-purple';
  } else if (state === 'available') {
    btnClass = 'score-btn-play score-available';
  } else if (state === 'zero-only') {
    btnClass = 'score-btn-play score-zero-only';
  } else {
    btnClass = 'score-btn score-empty';
  }

  // Build hint text
  const hintHtml = hint
    ? `<span class="score-hint">${escapeHtml(hint)}</span>`
    : '';

  // Speed bonus indicator
  const speedBonusHtml = speedBonus
    ? `<span class="speed-bonus">+${speedBonus.amount} ${speedBonus.text}</span>`
    : '';

  // Clear button (only show when filled and allowed)
  const clearBtnHtml = hasScore && showClear && onClear
    ? `<button class="clear-btn" onclick="${onClear}">✕</button>`
    : '';

  // Score button
  const disabledAttr = disabled ? 'disabled' : '';
  const onClickAttr = onSelect && !disabled ? `onclick="${onSelect}"` : '';

  return `
    <div class="score-row">
      <div class="score-row-label">
        <span class="label-text">${escapeHtml(label)}</span>
        ${hintHtml}
        ${speedBonusHtml}
      </div>
      <div class="score-row-actions">
        ${clearBtnHtml}
        <button class="${btnClass}" ${onClickAttr} ${disabledAttr}>
          ${displayValue}
        </button>
      </div>
    </div>
  `;
}

/**
 * ReadOnlyScoreRow Component
 * Display-only score row (no interaction)
 * @param {Object} options
 * @param {string} options.label - Category name
 * @param {number|string} options.value - Score value to display
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function ReadOnlyScoreRow({
  label,
  value,
  className = ''
}) {
  const classes = ['score-row', 'score-row-readonly', className].filter(Boolean).join(' ');
  const displayValue = value !== null && value !== undefined ? value : '—';

  return `
    <div class="${classes}">
      <span class="label">${escapeHtml(label)}</span>
      <span class="value">${displayValue}</span>
    </div>
  `;
}

/**
 * ScoreSection Component
 * Section wrapper for score rows with header
 * @param {Object} options
 * @param {string} options.title - Section title
 * @param {Object} [options.progress] - { current: number, total: number }
 * @param {string} options.children - HTML content (score rows)
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function ScoreSection({
  title,
  progress = null,
  children,
  className = ''
}) {
  const classes = ['score-section', className].filter(Boolean).join(' ');

  const progressHtml = progress
    ? `<span class="section-progress">${progress.current}/${progress.total}</span>`
    : '';

  return `
    <div class="${classes}">
      <div class="section-header">
        <h3 class="section-title">${escapeHtml(title)}</h3>
        ${progressHtml}
      </div>
      <div class="score-section-content">
        ${children}
      </div>
    </div>
  `;
}
