/**
 * End Screen View
 * Game completion and winner reveal
 */

import { S } from '../state.js';
import { color, escapeHtml } from '../utils/helpers.js';
import { standings } from './components/standings.js';

/**
 * Render end screen view
 * @returns {string} HTML string
 */
export function endScreenView() {
  if (!S.finishedGame) {
    return '';
  }

  const players = [...S.finishedGame.players].sort((a, b) => b.total - a.total);
  const maxScore = players[0].total;
  const winners = players.filter(p => p.total === maxScore);

  const isRevealing = !S.revealComplete;
  const visibleCount = S.revealComplete ? players.length : Math.max(0, S.revealIndex + 1);

  // Winner announcement
  const winnerOpacity = S.revealComplete ? '1' : '0';
  const winnerSection = winners.length === 1
    ? `<div class="text-4xl font-black mb-2 text-white" style="text-shadow:0 2px 4px rgba(0,0,0,0.2)">${escapeHtml(winners[0].name)}</div>
       <div class="text-xl text-white" style="opacity:0.9">is the Champion!</div>`
    : `<div class="text-3xl font-black mb-2 text-white" style="text-shadow:0 2px 4px rgba(0,0,0,0.2)">It's a Tie!</div>
       <div class="text-lg text-white" style="opacity:0.9">${winners.map(w => escapeHtml(w.name)).join(' & ')}</div>`;

  // Standings
  const standingsHtml = standings(players, maxScore, isRevealing, visibleCount, S.revealComplete);

  // Game stats
  const duration = S.finishedGame.dur ? `${S.finishedGame.dur} min` : 'N/A';
  const avgScore = Math.round(players.reduce((sum, p) => sum + p.total, 0) / players.length);
  const statsOpacity = S.revealComplete ? '1' : '0';

  // Fun stats (if Play Mode with dice history)
  const hasDiceHistory = S.finishedGame.diceHistory && S.finishedGame.diceHistory.length > 0;
  const funStatsHtml = hasDiceHistory ? renderFunStats(S.finishedGame.diceHistory, statsOpacity) : '';

  return `
    <div style="min-height:100vh;background:var(--bg);position:relative;overflow:hidden"
         onclick="${isRevealing ? 'skipReveal()' : ''}">
      <canvas id="fireworks-canvas"
              style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1"></canvas>

      <div style="position:relative;z-index:2;padding-bottom:2rem">
        <div class="header-gradient text-white p-6 text-center" style="padding-top:3rem;padding-bottom:3rem">
          <div style="min-height:5rem;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div style="opacity:${isRevealing ? '1' : '0'};transition:opacity 0.3s">
              <div class="text-2xl text-white animate-pulse" style="opacity:0.7">Revealing...</div>
            </div>
            <div style="opacity:${winnerOpacity};transition:opacity 0.8s ease-in;${isRevealing ? 'position:absolute;' : ''}">
              ${winnerSection}
            </div>
          </div>
          ${isRevealing ? '<p class="text-sm text-white mt-3" style="opacity:0.7">Tap to skip</p>' : ''}
        </div>

        <div class="p-4" style="max-width:28rem;margin:0 auto">
          <div class="card p-4 mb-4" style="background:linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%)">
            <h3 class="font-bold mb-4" style="color:var(--accent)">📊 FINAL STANDINGS</h3>
            ${standingsHtml}
          </div>

          <div class="card p-4 mb-4" style="opacity:${statsOpacity};transition:opacity 1s ease-in 0.3s">
            <h3 class="font-bold mb-4" style="color:var(--accent)">📈 Game Stats</h3>
            <div class="flex justify-between text-center">
              <div>
                <div class="text-2xl font-black" style="color:var(--accent)">${players.length}</div>
                <div class="text-xs text-gray-500">Players</div>
              </div>
              <div>
                <div class="text-2xl font-black" style="color:var(--accent)">${maxScore}</div>
                <div class="text-xs text-gray-500">High Score</div>
              </div>
              <div>
                <div class="text-2xl font-black" style="color:var(--accent)">${avgScore}</div>
                <div class="text-xs text-gray-500">Avg Score</div>
              </div>
              <div>
                <div class="text-2xl font-black" style="color:var(--accent)">${duration}</div>
                <div class="text-xs text-gray-500">Duration</div>
              </div>
            </div>
          </div>

          ${funStatsHtml}

          <button class="btn btn-primary w-full"
                  style="padding:1rem;font-size:1.125rem;opacity:${statsOpacity};transition:opacity 1s ease-in 0.5s"
                  onclick="event.stopPropagation();saveAndExit()">
            Continue to Home 🏠
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Animate the reveal sequence
 */
export function animateReveal() {
  if (!S.finishedGame || S.revealComplete) return;

  const totalPlayers = S.finishedGame.players.length;
  const delayPerPlayer = Math.max(600, Math.min(1000, 3000 / totalPlayers));

  function revealNext() {
    if (S.revealComplete || S.view !== 'endScreen') return;

    S.revealIndex++;

    if (S.revealIndex >= totalPlayers - 1) {
      // Final reveal
      setTimeout(() => {
        if (S.view === 'endScreen') {
          S.revealComplete = true;
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          window.R();
        }
      }, 400);
      window.R();
      return;
    }

    window.R();

    if (!S.revealComplete) {
      setTimeout(revealNext, delayPerPlayer);
    }
  }

  setTimeout(revealNext, 800);
}

/**
 * Skip the reveal animation
 */
export function skipReveal() {
  if (S.revealComplete) return;
  S.revealComplete = true;
  S.revealIndex = S.finishedGame.players.length - 1;
  window.R();
}

/**
 * Render fun stats section for Play Mode games
 * @param {Array<number>} diceHistory - Array of all rolled dice values
 * @param {string} opacity - CSS opacity value
 * @returns {string} HTML string
 */
function renderFunStats(diceHistory, opacity) {
  // Calculate number distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  diceHistory.forEach(value => {
    if (value >= 1 && value <= 6) {
      distribution[value]++;
    }
  });

  const totalRolls = diceHistory.length;
  const maxCount = Math.max(...Object.values(distribution));

  // Find most and least rolled numbers
  const mostRolled = Object.keys(distribution).filter(k => distribution[k] === maxCount);
  const minCount = Math.min(...Object.values(distribution));
  const leastRolled = Object.keys(distribution).filter(k => distribution[k] === minCount);

  // Create visual bars for number distribution
  const barsHtml = [1, 2, 3, 4, 5, 6].map(num => {
    const count = distribution[num];
    const percentage = totalRolls > 0 ? (count / totalRolls * 100).toFixed(1) : 0;
    const barWidth = totalRolls > 0 ? (count / maxCount * 100) : 0;
    const isMost = mostRolled.includes(String(num));
    const barColor = isMost ? 'var(--accent)' : 'var(--surface2)';

    return `
      <div style="margin-bottom:0.75rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem">
          <div style="display:flex;align-items:center;gap:0.5rem">
            <div style="width:2rem;height:2rem;background:${barColor};border-radius:0.375rem;display:flex;align-items:center;justify-content:center;color:var(--onAccent);font-weight:bold;font-size:0.875rem;box-shadow:0 2px 4px rgba(0,0,0,0.1)">
              ${num}
            </div>
            <span style="font-size:0.875rem;color:var(--text);font-weight:500">${count} rolls</span>
          </div>
          <span style="font-size:0.875rem;color:var(--textSec);font-weight:600">${percentage}%</span>
        </div>
        <div style="width:100%;height:0.5rem;background:var(--surface);border-radius:0.25rem;overflow:hidden">
          <div style="width:${barWidth}%;height:100%;background:${barColor};transition:width 0.5s ease-out"></div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="card p-4 mb-4" style="opacity:${opacity};transition:opacity 1s ease-in 0.4s">
      <h3 class="font-bold mb-4" style="color:var(--accent)">🎲 Fun Stats - Number Distribution</h3>
      <div style="margin-bottom:1rem">
        <div style="text-align:center;padding:0.75rem;background:var(--surface);border-radius:0.5rem;margin-bottom:1rem">
          <div style="font-size:1.5rem;font-weight:800;color:var(--accent)">${totalRolls}</div>
          <div style="font-size:0.75rem;color:var(--textSec)">Total Dice Rolled</div>
        </div>
      </div>
      ${barsHtml}
      <div style="margin-top:1rem;padding:0.75rem;background:var(--surface);border-radius:0.5rem;font-size:0.875rem;color:var(--textSec);text-align:center">
        ${mostRolled.length === 1
          ? `🔥 Most rolled: <strong style="color:var(--accent)">${mostRolled[0]}</strong> (${maxCount} times)`
          : `🔥 Most rolled: <strong style="color:var(--accent)">${mostRolled.join(', ')}</strong> (${maxCount} times each)`}
        ${mostRolled.length !== 6 && leastRolled.length > 0
          ? `<br/>❄️ Least rolled: <strong style="color:var(--text)">${leastRolled.join(', ')}</strong> (${minCount} times)`
          : ''}
      </div>
    </div>
  `;
}
