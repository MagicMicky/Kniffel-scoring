/**
 * Leaderboard View
 * Shows player rankings and fun statistics
 */

import { S } from '../state.js';
import { COLORS } from '../constants.js';
import { escapeHtml } from '../utils/helpers.js';

/**
 * Calculate player statistics from history
 * @param {number} playerId - Player ID
 * @returns {Object} Player statistics
 */
function calculatePlayerStats(playerId) {
  const games = S.history.filter(g => g.players.some(p => p.pid === playerId));
  const playerResults = games.map(g => g.players.find(p => p.pid === playerId)).filter(Boolean);

  if (playerResults.length === 0) {
    return {
      gamesPlayed: 0,
      wins: 0,
      winRate: 0,
      avgScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalScore: 0,
      totalYahtzees: 0,
      perfectGames: 0,
      currentStreak: 0,
      bestStreak: 0
    };
  }

  // Calculate wins
  const wins = games.filter(g => {
    const sorted = [...g.players].sort((a, b) => b.total - a.total);
    return sorted[0]?.pid === playerId;
  }).length;

  // Calculate scores
  const scores = playerResults.map(r => r.total);
  const totalScore = scores.reduce((sum, s) => sum + s, 0);
  const avgScore = Math.round(totalScore / scores.length);
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);

  // Calculate Yahtzees (initial + bonuses)
  const totalYahtzees = playerResults.reduce((sum, r) => {
    const initial = r.scores.yahtzee === 50 ? 1 : 0;
    const bonuses = (r.scores.bonus || 0) / 100;
    return sum + initial + bonuses;
  }, 0);

  // Count perfect games (300+)
  const perfectGames = scores.filter(s => s >= 300).length;

  // Calculate win streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = games.length - 1; i >= 0; i--) {
    const game = games[i];
    const sorted = [...game.players].sort((a, b) => b.total - a.total);
    const isWin = sorted[0]?.pid === playerId;

    if (isWin) {
      tempStreak++;
      if (i === games.length - 1) currentStreak = tempStreak;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      if (i === games.length - 1) currentStreak = 0;
      tempStreak = 0;
    }
  }

  return {
    gamesPlayed: playerResults.length,
    wins,
    winRate: Math.round((wins / playerResults.length) * 100),
    avgScore,
    bestScore,
    worstScore,
    totalScore,
    totalYahtzees,
    perfectGames,
    currentStreak,
    bestStreak
  };
}

/**
 * Get achievements for a player
 * @param {Object} stats - Player statistics
 * @param {boolean} isChampion - Is this player the champion?
 * @param {boolean} isSharpshooter - Highest average score?
 * @param {boolean} isLucky - Most Yahtzees?
 * @returns {Array} Array of achievement objects
 */
function getAchievements(stats, isChampion, isSharpshooter, isLucky) {
  const achievements = [];

  if (isChampion && stats.wins > 0) {
    achievements.push({ icon: '🏆', name: 'Champion', desc: 'Most wins' });
  }

  if (isSharpshooter && stats.gamesPlayed >= 3) {
    achievements.push({ icon: '🎯', name: 'Sharpshooter', desc: 'Highest avg' });
  }

  if (isLucky && stats.totalYahtzees > 0) {
    achievements.push({ icon: '🎲', name: 'Lucky', desc: 'Most Yahtzees' });
  }

  if (stats.currentStreak >= 3) {
    achievements.push({ icon: '🔥', name: 'Hot Streak', desc: `${stats.currentStreak} wins` });
  }

  if (stats.gamesPlayed >= 100) {
    achievements.push({ icon: '💯', name: 'Century Club', desc: '100+ games' });
  } else if (stats.gamesPlayed >= 50) {
    achievements.push({ icon: '🎪', name: 'Veteran', desc: '50+ games' });
  }

  if (stats.perfectGames > 0) {
    achievements.push({ icon: '⭐', name: 'Perfect Game', desc: '300+ score' });
  }

  if (stats.bestStreak >= 5) {
    achievements.push({ icon: '🌟', name: 'Dominator', desc: `${stats.bestStreak} streak` });
  }

  return achievements;
}

/**
 * Render the leaderboard view
 * @returns {string} HTML string
 */
export function leaderboardView() {
  if (S.known.length === 0) {
    return noPlayersMessage();
  }

  if (S.history.length === 0) {
    return noGamesMessage();
  }

  // Calculate stats for all players
  const playerStats = S.known.map((player, index) => {
    const stats = calculatePlayerStats(player.id);
    return {
      ...player,
      ...stats,
      color: COLORS[index % COLORS.length]
    };
  }).filter(p => p.gamesPlayed > 0);

  // Sort by average score (primary) and win rate (secondary)
  playerStats.sort((a, b) => {
    if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
    return b.winRate - a.winRate;
  });

  // Find champions
  const maxWins = Math.max(...playerStats.map(p => p.wins));
  const maxAvgScore = Math.max(...playerStats.map(p => p.avgScore));
  const maxYahtzees = Math.max(...playerStats.map(p => p.totalYahtzees));

  // Generate leaderboard HTML
  const leaderboardHtml = playerStats.map((player, index) => {
    const rank = index + 1;
    const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

    const isChampion = player.wins === maxWins && maxWins > 0;
    const isSharpshooter = player.avgScore === maxAvgScore && player.gamesPlayed >= 3;
    const isLucky = player.totalYahtzees === maxYahtzees && maxYahtzees > 0;

    const achievements = getAchievements(player, isChampion, isSharpshooter, isLucky);
    const achievementsBadges = achievements.length > 0
      ? `<div class="achievements-row">
          ${achievements.map(a => `
            <button class="achievement-badge" onclick="showBadgeInfo('${a.icon}', '${a.name}', '${escapeHtml(a.desc)}')">
              <span class="achievement-icon">${a.icon}</span>
            </button>
          `).join('')}
         </div>`
      : '';

    return `
      <div class="leaderboard-card glass rounded-2xl p-4 mb-3"
           style="border-left: 4px solid ${player.color}">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3 flex-1">
            <div class="rank-badge ${rank <= 3 ? 'rank-top' : ''}">
              ${rankEmoji}
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-black text-white mb-1">${escapeHtml(player.name)}</h3>
              <div class="flex gap-2 flex-wrap text-xs">
                <span class="stat-pill">
                  🎮 ${player.gamesPlayed} game${player.gamesPlayed !== 1 ? 's' : ''}
                </span>
                <span class="stat-pill stat-pill-green">
                  🏆 ${player.wins} win${player.wins !== 1 ? 's' : ''}
                </span>
                <span class="stat-pill stat-pill-blue">
                  📊 ${player.winRate}% win rate
                </span>
              </div>
            </div>
          </div>
        </div>

        ${achievementsBadges}

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">${player.avgScore}</div>
            <div class="stat-label">Average</div>
          </div>
          <div class="stat-box">
            <div class="stat-value text-green-400">${player.bestScore}</div>
            <div class="stat-label">Best</div>
          </div>
          <div class="stat-box">
            <div class="stat-value text-orange-400">${player.worstScore}</div>
            <div class="stat-label">Worst</div>
          </div>
          <div class="stat-box">
            <div class="stat-value text-yellow-400">🎲 ${player.totalYahtzees}</div>
            <div class="stat-label">Yahtzees</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Badge info modal
  const badgeModal = S.selectedBadge ? `
    <div class="modal-overlay" onclick="closeBadgeInfo()">
      <div class="modal badge-modal" onclick="event.stopPropagation()">
        <div class="text-center mb-4">
          <div class="badge-modal-icon">${S.selectedBadge.icon}</div>
          <h2 class="text-2xl font-black text-white mb-2">${escapeHtml(S.selectedBadge.name)}</h2>
          <p class="text-purple-200">${escapeHtml(S.selectedBadge.desc)}</p>
        </div>
        <button class="btn btn-primary w-full" onclick="closeBadgeInfo()">Got it!</button>
      </div>
    </div>
  ` : '';

  return `
    <div class="container" style="min-height:100vh">
      <div class="flex items-center justify-between mb-6">
        <button class="btn-text text-purple-200 text-lg font-medium" onclick="navigateTo('setup')">
          ← Back
        </button>
        <h1 class="text-2xl font-black text-white">🏆 Leaderboard</h1>
        <div style="width:4rem"></div>
      </div>

      <div class="glass rounded-2xl p-4 mb-4 text-center">
        <p class="text-purple-200 text-sm">
          📈 Ranked by average score across all games
        </p>
      </div>

      ${leaderboardHtml}
    </div>
    ${badgeModal}
  `;
}

/**
 * Create no players message
 */
function noPlayersMessage() {
  return `
    <div class="container" style="min-height:100vh">
      <div class="flex items-center justify-between mb-6">
        <button class="btn-text text-purple-200 text-lg font-medium" onclick="navigateTo('setup')">
          ← Back
        </button>
        <h1 class="text-2xl font-black text-white">🏆 Leaderboard</h1>
        <div style="width:4rem"></div>
      </div>
      <div class="text-center py-10 text-purple-200">
        <p class="text-5xl mb-4">🏆</p>
        <p class="text-xl mb-2">No players yet!</p>
        <p class="text-sm">Add some players to get started</p>
      </div>
    </div>
  `;
}

/**
 * Create no games message
 */
function noGamesMessage() {
  return `
    <div class="container" style="min-height:100vh">
      <div class="flex items-center justify-between mb-6">
        <button class="btn-text text-purple-200 text-lg font-medium" onclick="navigateTo('setup')">
          ← Back
        </button>
        <h1 class="text-2xl font-black text-white">🏆 Leaderboard</h1>
        <div style="width:4rem"></div>
      </div>
      <div class="text-center py-10 text-purple-200">
        <p class="text-5xl mb-4">🎮</p>
        <p class="text-xl mb-2">No games played yet!</p>
        <p class="text-sm">Play some games to see the leaderboard</p>
      </div>
    </div>
  `;
}
