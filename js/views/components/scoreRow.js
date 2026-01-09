/**
 * Score Row Component
 * Renders individual score rows for upper and lower sections
 */

/**
 * Create an upper section score row (Score Mode)
 * @param {Object} category - Category config {id, name, value}
 * @param {number|null} score - Current score value
 * @returns {string} HTML string
 */
export function upperScoreRow(category, score) {
  const possibleValues = [0, 1, 2, 3, 4, 5].map(n => n * category.value).join(',');
  const hasScore = score !== null;

  return `
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex-1">
        <span class="font-medium text-gray-800">${category.name}</span>
        <span class="text-xs text-gray-400 ml-2">(${possibleValues})</span>
      </div>
      <div class="flex items-center gap-2">
        ${hasScore ? `<button class="clear-btn" onclick="clr('${category.id}')">✕</button>` : ''}
        <button class="score-btn ${hasScore ? 'score-filled-blue' : 'score-empty'}"
                onclick="openUp('${category.id}',${category.value},'${category.name}')">
          ${hasScore ? score : 'Tap'}
        </button>
      </div>
    </div>
    <div class="divider"></div>
  `;
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

  return `
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex-1">
        <span class="font-medium text-gray-800">${category.name}</span>
        <span class="text-xs text-gray-400 ml-2">${rangeHint}</span>
      </div>
      <div class="flex items-center gap-2">
        ${hasScore ? `<button class="clear-btn" onclick="clr('${category.id}')">✕</button>` : ''}
        <button class="score-btn ${hasScore ? 'score-filled-purple' : 'score-empty'}"
                onclick="openLo('${category.id}','${category.type}',${category.fixed || category.max},'${category.name}')">
          ${hasScore ? score : 'Tap'}
        </button>
      </div>
    </div>
    <div class="divider"></div>
  `;
}

/**
 * Create an upper section score row (Play Mode)
 * @param {Object} category - Category config
 * @param {number|null} currentScore - Current saved score
 * @param {number} possibleScore - Possible score with current dice
 * @param {boolean} canSelect - Whether player can select a score
 * @returns {string} HTML string
 */
export function upperScoreRowPlay(category, currentScore, possibleScore, canSelect) {
  if (currentScore !== null) {
    return `
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-medium text-gray-800">${category.name}</span>
        <div class="flex items-center gap-2">
          <button class="clear-btn" onclick="clr('${category.id}')">✕</button>
          <span class="score-btn score-filled-blue">${currentScore}</span>
        </div>
      </div>
      <div class="divider"></div>
    `;
  } else if (canSelect) {
    const btnClass = possibleScore > 0 ? 'score-available' : 'score-zero-only';
    return `
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-medium text-gray-800">${category.name}</span>
        <button class="score-btn-play ${btnClass}"
                onclick="selectPlayScore('${category.id}',${possibleScore})">
          ${possibleScore}
        </button>
      </div>
      <div class="divider"></div>
    `;
  } else {
    return `
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-medium text-gray-400">${category.name}</span>
        <span class="score-btn score-empty">-</span>
      </div>
      <div class="divider"></div>
    `;
  }
}

/**
 * Create a lower section score row (Play Mode)
 * @param {Object} category - Category config
 * @param {number|null} currentScore - Current saved score
 * @param {number} possibleScore - Possible score with current dice
 * @param {boolean} canSelect - Whether player can select a score
 * @returns {string} HTML string
 */
export function lowerScoreRowPlay(category, currentScore, possibleScore, canSelect) {
  if (currentScore !== null) {
    return `
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-medium text-gray-800">${category.name}</span>
        <div class="flex items-center gap-2">
          <button class="clear-btn" onclick="clr('${category.id}')">✕</button>
          <span class="score-btn score-filled-purple">${currentScore}</span>
        </div>
      </div>
      <div class="divider"></div>
    `;
  } else if (canSelect) {
    const btnClass = possibleScore > 0 ? 'score-available' : 'score-zero-only';
    return `
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-medium text-gray-800">${category.name}</span>
        <button class="score-btn-play ${btnClass}"
                onclick="selectPlayScore('${category.id}',${possibleScore})">
          ${possibleScore}
        </button>
      </div>
      <div class="divider"></div>
    `;
  } else {
    return `
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-medium text-gray-400">${category.name}</span>
        <span class="score-btn score-empty">-</span>
      </div>
      <div class="divider"></div>
    `;
  }
}

/**
 * Create a read-only score row (for history view)
 * @param {string} name - Category name
 * @param {number} score - Score value
 * @param {string} colorClass - CSS class for styling
 * @returns {string} HTML string
 */
export function readOnlyScoreRow(name, score, colorClass) {
  return `
    <div class="flex items-center justify-between px-4 py-3">
      <span class="font-medium text-gray-800">${name}</span>
      <span class="score-btn ${colorClass}">${score !== null ? score : 0}</span>
    </div>
    <div class="divider"></div>
  `;
}
