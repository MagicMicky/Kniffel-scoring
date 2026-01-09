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
