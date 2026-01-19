/**
 * Game Constants
 * Defines the scoring categories and player colors
 */

// Upper section scoring categories
export const UPPER = [
  { id: 'ones', name: 'Ones', value: 1 },
  { id: 'twos', name: 'Twos', value: 2 },
  { id: 'threes', name: 'Threes', value: 3 },
  { id: 'fours', name: 'Fours', value: 4 },
  { id: 'fives', name: 'Fives', value: 5 },
  { id: 'sixes', name: 'Sixes', value: 6 },
];

// Lower section scoring categories
export const LOWER = [
  { id: 'threeOfKind', name: '3 of a Kind', type: 'sum', max: 30 },
  { id: 'fourOfKind', name: '4 of a Kind', type: 'sum', max: 30 },
  { id: 'fullHouse', name: 'Full House', type: 'fixed', fixed: 25 },
  { id: 'smallStraight', name: 'Sm. Straight', type: 'fixed', fixed: 30 },
  { id: 'largeStraight', name: 'Lg. Straight', type: 'fixed', fixed: 40 },
  { id: 'yahtzee', name: 'YAHTZEE!', type: 'fixed', fixed: 50 },
  { id: 'chance', name: 'Chance', type: 'sum', max: 30 },
];

// Player colors - warm gold and brown palette matching Craft Game Lounge theme
export const COLORS = [
  '#d4a574',  // 1. Gold Primary - main gold
  '#e6b873',  // 2. Gold Bright - brighter gold
  '#c9b397',  // 3. Gold Muted - muted gold
  '#b8956d',  // 4. Bronze - deeper bronze
  '#a67c52',  // 5. Caramel - warm caramel
  '#8b7355',  // 6. Brown Gold - brown-gold
  '#daa85e',  // 7. Amber Gold - amber variation
  '#bd9968'   // 8. Copper Gold - copper tone
];

// Blitz mode timer configuration
export const BLITZ_TIMER_DURATION = 15; // Total seconds per turn in blitz mode
export const BLITZ_SPEED_BONUS_WINDOW = 5; // Seconds within which player must score to get speed bonus
export const BLITZ_SPEED_BONUS_POINTS = 5; // Points awarded for speed bonus

/**
 * Check if speed bonus should be awarded in blitz mode
 * @param {number} timeRemaining - Seconds remaining on the timer
 * @returns {boolean} True if player scored fast enough to earn bonus
 */
export function shouldAwardSpeedBonus(timeRemaining) {
  // Award bonus if time remaining is MORE than (total - bonus window)
  // Example: If total is 15s and window is 5s, award if ≥10s remain (scored within first 5s)
  const threshold = BLITZ_TIMER_DURATION - BLITZ_SPEED_BONUS_WINDOW;
  return timeRemaining >= threshold;
}
