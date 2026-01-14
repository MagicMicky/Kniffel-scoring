/**
 * Export/Import Service
 * Handles data export and import functionality
 */

import { S } from '../state.js';
import { showToast } from './toast.js';
import { ensureSpeedBonuses } from '../utils/storage.js';

/**
 * Export all data to JSON file
 */
export function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    players: JSON.parse(localStorage.getItem('yahtzeeP') || '[]'),
    history: JSON.parse(localStorage.getItem('yahtzeeH') || '[]')
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'yahtzee-data-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Data exported! 📥');
}

/**
 * Import data from JSON string
 * @param {string} jsonString - JSON data to import
 * @param {Function} render - Render callback function
 */
export function importData(jsonString, render) {
  try {
    const data = JSON.parse(jsonString);

    // Validate
    if (!data.players || !Array.isArray(data.players) ||
        !data.history || !Array.isArray(data.history)) {
      throw new Error('Invalid file format');
    }

    // Load existing
    let players = JSON.parse(localStorage.getItem('yahtzeeP') || '[]');
    let history = JSON.parse(localStorage.getItem('yahtzeeH') || '[]');

    // Merge players (avoid duplicates by id)
    const existingPlayerIds = new Set(players.map(p => p.id));
    let newPlayersCount = 0;
    for (const player of data.players) {
      if (!existingPlayerIds.has(player.id)) {
        players.push(player);
        newPlayersCount++;
      }
    }

    // Merge history (avoid duplicates by id)
    const existingHistoryIds = new Set(history.map(h => h.id));
    let newHistoryCount = 0;
    for (const entry of data.history) {
      if (!existingHistoryIds.has(entry.id)) {
        // Ensure backward compatibility with old games
        entry.players.forEach(p => ensureSpeedBonuses(p.scores));
        history.push(entry);
        newHistoryCount++;
      }
    }

    // Sort history by date (newest first)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save
    localStorage.setItem('yahtzeeP', JSON.stringify(players));
    localStorage.setItem('yahtzeeH', JSON.stringify(history));

    // Update state
    S.known = players;
    S.history = history;

    showToast('Imported: ' + newPlayersCount + ' players, ' + newHistoryCount + ' games 📤');
    render();
  } catch (error) {
    alert('Import failed: ' + error.message);
  }
}

/**
 * Trigger file input for import
 * @param {Function} render - Render callback function
 */
export function triggerImport(render) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        importData(event.target.result, render);
      };
      reader.readAsText(file);
    }
  };
  input.click();
}
