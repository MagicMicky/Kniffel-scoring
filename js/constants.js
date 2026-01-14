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

// Player colors - diverse palette for up to 8 players with clear differentiation
export const COLORS = [
  '#39C6A7',  // 1. Jade (accent) - primary brand
  '#7AE7D0',  // 2. Sky jade (link) - bright cyan
  '#F4B24A',  // 3. Amber (warning) - warm yellow
  '#FB7185',  // 4. Coral (error) - pink/salmon
  '#34D399',  // 5. Emerald (success) - bright green
  '#22D3EE',  // 6. Aqua - turquoise
  '#A78BFA',  // 7. Lavender - purple
  '#FB923C'   // 8. Peach - orange
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
