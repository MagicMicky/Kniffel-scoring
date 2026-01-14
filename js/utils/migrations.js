/**
 * Data Migration Utilities
 * Handles upgrading old data formats to new schemas
 */

import { S } from '../state.js';
import { save } from './storage.js';

/**
 * Detect if a game record is from blitz mode based on filled categories
 * Blitz games have exactly 6 filled categories (excluding bonus)
 * @param {Object} gameRecord - Game record from history
 * @returns {boolean} True if this appears to be a blitz game
 */
function isBlitzGame(gameRecord) {
  if (!gameRecord.players || gameRecord.players.length === 0) {
    return false;
  }

  // Check first player's scores (all players have same number of categories in a game)
  const scores = gameRecord.players[0].scores;
  if (!scores) return false;

  // Count non-null categories (excluding bonus)
  const filledCategories = Object.keys(scores).filter(key => {
    return key !== 'bonus' && scores[key] !== null && scores[key] !== undefined;
  }).length;

  // Blitz games have exactly 6 categories
  return filledCategories === 6;
}

/**
 * Migrate old game records to include mode and isBlitzMode fields
 * @returns {number} Number of games migrated
 */
export function migrateGameHistory() {
  let migrated = 0;

  S.history.forEach(game => {
    // Only migrate games that don't have the new fields
    if (game.mode === undefined || game.isBlitzMode === undefined) {
      // Detect if it's a blitz game
      const isBlitz = isBlitzGame(game);

      // Add the new fields
      game.mode = 'score'; // We can't determine the original mode, default to 'score'
      game.isBlitzMode = isBlitz;

      migrated++;
    }
  });

  // Save if we migrated any games
  if (migrated > 0) {
    save();
    console.log(`✅ Migrated ${migrated} game(s) to new format`);
  }

  return migrated;
}

/**
 * Run all migrations
 * Called once on app startup
 */
export function runMigrations() {
  console.log('🔄 Running data migrations...');

  const gamesMigrated = migrateGameHistory();

  if (gamesMigrated > 0) {
    console.log(`✅ Migration complete: ${gamesMigrated} games updated`);
  } else {
    console.log('✅ No migrations needed');
  }
}
