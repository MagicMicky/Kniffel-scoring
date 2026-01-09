/**
 * Score Picker Component
 * Modal for selecting scores in score mode
 */

import { S } from '../../state.js';
import { modal } from './modal.js';

/**
 * Create the score picker modal
 * @returns {string} HTML string or empty if no picker active
 */
export function picker() {
  if (!S.picker) return '';

  const c = S.picker;

  if (c.t === 'upper') {
    return upperPicker(c);
  } else if (c.t === 'fixed') {
    return fixedPicker(c);
  } else {
    return sumPicker(c);
  }
}

/**
 * Create upper section picker (count multiplier)
 * @param {Object} config - Picker config
 * @returns {string} HTML string
 */
function upperPicker(config) {
  const buttons = [0, 1, 2, 3, 4, 5].map(n => `
    <button class="picker-btn" onclick="sel(${n * config.v})">
      <div class="text-2xl font-black text-blue-600">${n * config.v}</div>
      <div class="text-xs text-gray-500">${n} × ${config.v}</div>
    </button>
  `).join('');

  return modal(`
    <div class="text-center mb-4">
      <h3 class="text-xl font-black text-gray-800">${config.name}</h3>
      <p class="text-blue-600 text-sm mt-1">How many ${config.v}s did you roll?</p>
    </div>
    <div class="grid grid-cols-3 gap-2 mb-4">${buttons}</div>
    <button class="btn btn-gray font-medium py-3 px-4 rounded-xl w-full" onclick="S.picker=null;R()">
      Cancel
    </button>
  `, 'S.picker=null;R()');
}

/**
 * Create fixed score picker (0 or fixed value)
 * @param {Object} config - Picker config
 * @returns {string} HTML string
 */
function fixedPicker(config) {
  return modal(`
    <div class="text-center mb-4">
      <h3 class="text-xl font-black text-gray-800">${config.name}</h3>
      <p class="text-sm mt-1" style="visibility:hidden">Spacer</p>
    </div>
    <button class="picker-btn p-6 mb-4 w-full" onclick="sel(${config.v})">
      <div class="text-4xl font-black text-blue-600">${config.v}</div>
    </button>
    <div class="grid grid-cols-2 gap-2">
      <button class="btn btn-red font-medium py-3 px-4 rounded-xl" onclick="sel(0)">Zero</button>
      <button class="btn btn-gray font-medium py-3 px-4 rounded-xl" onclick="S.picker=null;R()">Cancel</button>
    </div>
  `, 'S.picker=null;R()');
}

/**
 * Create sum picker (custom value input)
 * @param {Object} config - Picker config
 * @returns {string} HTML string
 */
function sumPicker(config) {
  const quickButtons = [5, 10, 15, 20, 25, 30].map(n => `
    <button class="picker-btn-purple text-purple-700 font-bold text-sm" onclick="sel(${n})">
      ${n}
    </button>
  `).join('');

  return modal(`
    <div class="text-center mb-4">
      <h3 class="text-xl font-black text-gray-800">${config.name}</h3>
      <p class="text-purple-600 text-sm mt-1">Sum of all dice (5-30)</p>
    </div>
    <p class="text-xs text-gray-400 mb-2 text-center">Quick select:</p>
    <div class="grid grid-cols-6 gap-1 mb-4">${quickButtons}</div>
    <div class="flex gap-2 mb-4">
      <input type="number" id="cust" min="5" max="30"
             class="input flex-1 text-center text-xl font-bold" placeholder="Custom...">
      <button class="btn btn-purple font-bold py-3 px-4 rounded-xl" onclick="subCust()">✓</button>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <button class="btn btn-red font-medium py-3 px-4 rounded-xl" onclick="sel(0)">Zero</button>
      <button class="btn btn-gray font-medium py-3 px-4 rounded-xl" onclick="S.picker=null;R()">Cancel</button>
    </div>
  `, 'S.picker=null;R()');
}
