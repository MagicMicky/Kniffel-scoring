/**
 * Side Menu Component
 * Hamburger menu with app options
 */

import { S } from '../../state.js';

/**
 * Create the hamburger button
 * @returns {string} HTML string
 */
export function hamburgerButton() {
  return `<button class="hamburger-btn btn" onclick="toggleSideMenu()">☰</button>`;
}

/**
 * Create the side menu
 * @returns {string} HTML string
 */
export function sideMenu() {
  const openClass = S.sideMenuOpen ? 'open' : '';

  return `
    <div class="side-menu-overlay ${openClass}" onclick="toggleSideMenu()"></div>
    <div class="side-menu ${openClass}">
      <div class="side-menu-header">
        <h2 class="text-xl font-black text-white">Menu</h2>
      </div>
      <div class="side-menu-content">
        <button class="side-menu-item btn" onclick="exportData();toggleSideMenu()">
          📥 Export Data
        </button>
        <button class="side-menu-item btn" onclick="triggerImport();toggleSideMenu()">
          📤 Import Data
        </button>
        <button class="side-menu-item btn" onclick="navigateTo('history');toggleSideMenu()">
          📜 Game History
        </button>
        <button class="side-menu-item btn" onclick="forceUpdate()">
          🔄 Update App
        </button>
      </div>
      <div class="side-menu-footer">
        <div class="text-xs text-gray-400" style="text-align:center;padding:1rem;font-family:monospace;">
          ${S.version}
        </div>
      </div>
    </div>
  `;
}
