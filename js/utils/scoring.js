/**
 * Scoring Utility Functions
 * Calculate totals, bonuses, and grand totals
 */

import { S } from '../state.js';

/**
 * Calculate upper section total
 * @param {Object} scores - Player scores object
 * @returns {number} Total of upper section scores
 */
export function upTot(scores) {
  return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes']
    .reduce((acc, key) => acc + (scores[key] || 0), 0);
}

/**
 * Calculate upper section bonus (35 if total >= 63)
 * Disabled in blitz mode
 * @param {Object} scores - Player scores object
 * @returns {number} 35 or 0
 */
export function upBonus(scores) {
  if (S.isBlitzMode) return 0;
  return upTot(scores) >= 63 ? 35 : 0;
}

/**
 * Calculate lower section total (including yahtzee bonus)
 * Yahtzee bonus disabled in blitz mode
 * @param {Object} scores - Player scores object
 * @returns {number} Total of lower section scores
 */
export function loTot(scores) {
  const categoryTotal = ['threeOfKind', 'fourOfKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance']
    .reduce((acc, key) => acc + (scores[key] || 0), 0);
  const yahtzeeBonus = S.isBlitzMode ? 0 : (scores.bonus || 0);
  return categoryTotal + yahtzeeBonus;
}

/**
 * Calculate grand total
 * @param {Object} scores - Player scores object
 * @returns {number} Grand total (upper + bonus + lower)
 */
export function grand(scores) {
  return upTot(scores) + upBonus(scores) + loTot(scores);
}

/**
 * Calculate score for a specific category based on dice
 * @param {number[]} dice - Array of 5 dice values
 * @param {string} category - Category ID
 * @returns {number} Calculated score
 */
export function calcScore(dice, category) {
  const counts = [0, 0, 0, 0, 0, 0, 0]; // index 0 unused, 1-6 for dice values
  dice.forEach(d => counts[d]++);
  const sum = dice.reduce((a, b) => a + b, 0);
  const sortedCounts = [...counts.slice(1)].sort((a, b) => b - a);
  const uniqueValues = new Set(dice);
  const sortedDice = [...dice].sort((a, b) => a - b);

  switch (category) {
    // Upper section - count specific number
    case 'ones': return counts[1] * 1;
    case 'twos': return counts[2] * 2;
    case 'threes': return counts[3] * 3;
    case 'fours': return counts[4] * 4;
    case 'fives': return counts[5] * 5;
    case 'sixes': return counts[6] * 6;

    // Three of a kind - sum of all dice if 3+ match
    case 'threeOfKind':
      return sortedCounts[0] >= 3 ? sum : 0;

    // Four of a kind - sum of all dice if 4+ match
    case 'fourOfKind':
      return sortedCounts[0] >= 4 ? sum : 0;

    // Full House - 3 of one, 2 of another = 25 points
    case 'fullHouse':
      return (sortedCounts[0] === 3 && sortedCounts[1] === 2) ? 25 : 0;

    // Small Straight - 4 consecutive = 30 points
    case 'smallStraight': {
      const patterns = [[1,2,3,4], [2,3,4,5], [3,4,5,6]];
      const hasSmall = patterns.some(p => p.every(n => uniqueValues.has(n)));
      return hasSmall ? 30 : 0;
    }

    // Large Straight - 5 consecutive = 40 points
    case 'largeStraight': {
      const isLarge = (sortedDice.join('') === '12345' || sortedDice.join('') === '23456');
      return isLarge ? 40 : 0;
    }

    // Yahtzee - all 5 same = 50 points
    case 'yahtzee':
      return sortedCounts[0] === 5 ? 50 : 0;

    // Chance - sum of all dice
    case 'chance':
      return sum;

    default:
      return 0;
  }
}

/**
 * Get all possible scores for current dice
 * @param {number[]} dice - Array of 5 dice values
 * @returns {Object} Object mapping category IDs to scores
 */
export function getPossibleScores(dice) {
  const categories = [
    'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
    'threeOfKind', 'fourOfKind', 'fullHouse',
    'smallStraight', 'largeStraight', 'yahtzee', 'chance'
  ];
  const scores = {};
  categories.forEach(cat => {
    scores[cat] = calcScore(dice, cat);
  });
  return scores;
}
