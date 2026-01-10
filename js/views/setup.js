/**
 * Setup View
 * Main setup/home screen
 */

import { S } from '../state.js';
import { COLORS } from '../constants.js';
import { escapeHtml } from '../utils/helpers.js';
import { hamburgerButton, sideMenu } from './components/sideMenu.js';
import { modal } from './components/modal.js';
import { upTot, grand, upBonus, loTot } from '../utils/scoring.js';

/**
 * Render the setup view
 * @returns {string} HTML string
 */
export function setupView() {
  const playerList = S.known.length === 0
    ? noPlayersMessage()
    : playerSelectionList();

  const playOrder = S.game.length > 0
    ? `<div class="glass rounded-xl p-3 mt-4">
        <p class="text-sm text-purple-200 mb-1">Play order:</p>
        <p class="font-medium text-white">${S.game.map(p => escapeHtml(p.name)).join(' → ')}</p>
       </div>`
    : '';

  const resumeButton = S.savedGame ? resumeGameSection() : '';

  return `
    <div class="container" style="min-height:100vh">
      ${hamburgerButton()}
      ${sideMenu()}
      <div class="text-center mb-6">
        <div class="mb-2">
          <img src="icon-192-v2.png" alt="Schnitzel"
               style="width:96px;height:96px;margin:0 auto;border-radius:20px;box-shadow:0 4px 12px rgba(0,0,0,0.3)">
        </div>
        <h1 class="text-4xl font-black text-white">SCHNITZEL</h1>
        <p class="text-purple-200 text-sm">your Yahtzee companion app</p>
      </div>
      ${savedGameBanner()}
      ${resumeButton}
      <div class="glass rounded-2xl p-5 mb-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-white">Select Players</h2>
          <button class="btn btn-small glass text-white" onclick="S.mgr=true;R()">⚙️</button>
        </div>
        <div class="space-y-2">${playerList}</div>
        ${playOrder}
      </div>
      ${gameModeButtons()}
    </div>
    ${S.mgr ? managerModal() : ''}
    ${S.stats ? statsModal() : ''}
  `;
}

/**
 * Create no players message
 */
function noPlayersMessage() {
  return `
    <div class="text-center py-5 text-purple-200">
      <p class="mb-2">No players yet!</p>
      <button class="btn btn-small glass text-white" onclick="S.mgr=true;R()">+ Add Players</button>
    </div>
  `;
}

/**
 * Create player selection list
 */
function playerSelectionList() {
  return S.known.map((p, i) => {
    const isSelected = S.game.some(g => g.id === p.id);
    const gameIndex = S.game.findIndex(g => g.id === p.id);
    const playerColor = COLORS[i % COLORS.length];

    const selectedStyle = isSelected ? `box-shadow:0 0 0 2px ${playerColor};` : '';
    const cardClass = isSelected ? 'glass-dark' : 'glass';

    const orderButtons = isSelected
      ? `<button class="order-btn" onclick="event.stopPropagation();mv(${gameIndex},-1)">▲</button>
         <button class="order-btn" onclick="event.stopPropagation();mv(${gameIndex},1)">▼</button>`
      : '';

    return `
      <div class="flex items-center gap-2 rounded-xl p-3 ${cardClass}"
           style="${selectedStyle}" onclick="tog(${p.id})">
        <div class="checkbox">${isSelected ? '<div class="checkbox-inner"></div>' : ''}</div>
        <div class="color-dot" style="background:${playerColor}"></div>
        <span class="flex-1 font-medium text-white">${escapeHtml(p.name)}</span>
        ${orderButtons}
        <button class="btn btn-small glass text-white text-xs"
                onclick="event.stopPropagation();S.stats=S.known.find(x=>x.id===${p.id});R()">📊</button>
      </div>
    `;
  }).join('');
}

/**
 * Create saved game banner
 */
function savedGameBanner() {
  if (!S.savedGame) return '';

  let modeIcon = S.savedGame.mode === 'play' ? '🎲' : '📝';
  if (S.savedGame.isBlitzMode) {
    modeIcon = '⚡';
  }
  const players = S.savedGame.game.map(p => escapeHtml(p.name)).join(', ');
  const savedDate = new Date(S.savedGame.savedAt).toLocaleString();

  return `
    <div class="glass rounded-2xl p-4 mb-2">
      <p class="text-white font-bold mb-2">📌 Paused Game ${modeIcon}</p>
      <p class="text-purple-200 text-sm">${players}</p>
      <p class="text-purple-200 text-xs mt-1">${savedDate}</p>
    </div>
  `;
}

/**
 * Create resume game buttons
 */
function resumeGameSection() {
  return `
    <div class="grid grid-cols-2 gap-2 mb-4">
      <button class="btn btn-secondary" style="padding:0.5rem;" onclick="discardSaved()">🗑️ Discard</button>
      <button class="btn btn-resume" style="padding:0.5rem;" onclick="resumeGame()">▶️ RESUME</button>
    </div>
  `;
}

/**
 * Create game mode selection buttons
 */
function gameModeButtons() {
  const disabled = S.game.length === 0 ? 'disabled' : '';
  const isExpanded = S.virtualDiceExpanded;
  const expandIcon = isExpanded ? '▲' : '▼';

  return `
    <div class="mode-select-container">
      <button class="game-mode-btn" onclick="startGameWithMode('score')" ${disabled}>
        <div class="icon">🎲</div>
        <div class="title">PHYSICAL DICE</div>
        <div class="desc">Roll real dice<br>Enter scores</div>
      </button>

      <div class="expandable-mode-container">
        <button class="game-mode-btn expandable-header ${isExpanded ? 'expanded' : ''}"
                onclick="startGameWithMode('play', false)" ${disabled}>
          <div class="icon">📱</div>
          <div class="title">VIRTUAL DICE</div>
          <div class="desc">Roll on phone<br>Auto-scoring</div>
          <span class="expand-icon" onclick="event.stopPropagation();toggleVirtualDiceExpanded()">${expandIcon}</span>
        </button>

        <div class="expandable-content ${isExpanded ? 'expanded' : ''}">
          <button class="mode-variant-btn"
                  onclick="startGameWithMode('play', false)" ${disabled}>
            <div class="variant-icon">📱</div>
            <div class="variant-info">
              <div class="variant-title">Standard Game</div>
              <div class="variant-desc">3 rolls • All 13 categories</div>
            </div>
          </button>

          <button class="mode-variant-btn"
                  onclick="startGameWithMode('play', true)" ${disabled}>
            <div class="variant-icon">⚡</div>
            <div class="variant-info">
              <div class="variant-title">Blitz Mode</div>
              <div class="variant-desc">2 rolls • 6 categories • 15s timer</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create player manager modal
 */
function managerModal() {
  const playerList = S.known.map((p, i) => `
    <div class="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
      <div class="color-dot" style="background:${COLORS[i % COLORS.length]}"></div>
      <input type="text" class="input flex-1" value="${escapeHtml(p.name)}" onchange="ren(${p.id},this.value)">
      <button class="delete-btn" onclick="del(${p.id})">Delete</button>
    </div>
  `).join('');

  return modal(`
    <h2 class="text-xl font-black text-gray-800 mb-4">👥 Manage Players</h2>
    <div class="space-y-2 mb-4">${playerList}</div>
    <div class="flex gap-2 mb-4">
      <input type="text" id="np" class="input flex-1" placeholder="New player..."
             onkeypress="if(event.key==='Enter')addP()">
      <button class="btn btn-blue btn-small text-white" onclick="addP()">Add</button>
    </div>
    <button class="btn btn-green font-bold py-3 px-4 rounded-xl w-full" onclick="S.mgr=false;save();R()">
      Done
    </button>
  `, 'S.mgr=false;save();R()');
}

/**
 * Create statistics modal
 */
function statsModal() {
  const p = S.stats;
  const games = S.history.filter(g => g.players.some(x => x.pid === p.id));
  const results = games.map(g => g.players.find(x => x.pid === p.id)).filter(Boolean);
  const wins = games.filter(g => {
    const sorted = [...g.players].sort((a, b) => b.total - a.total);
    return sorted[0]?.pid === p.id;
  }).length;
  const highScore = results.length ? Math.max(...results.map(r => r.total)) : 0;
  const avgScore = results.length ? Math.round(results.reduce((a, r) => a + r.total, 0) / results.length) : 0;
  const yahtzees = results.reduce((a, r) => a + (r.scores.yahtzee === 50 ? 1 : 0) + (r.scores.bonus / 100), 0);

  const statsContent = results.length === 0
    ? '<p class="text-center text-gray-400 py-5">No games yet</p>'
    : `
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div style="background:var(--surface2);border:1px solid var(--border)" class="rounded-xl p-4 text-center">
          <div class="text-3xl font-black text-blue-600">${results.length}</div>
          <div class="text-xs text-gray-500">Games</div>
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border)" class="rounded-xl p-4 text-center">
          <div class="text-3xl font-black text-yellow-600">${wins}</div>
          <div class="text-xs text-gray-500">Wins (${results.length ? Math.round(wins / results.length * 100) : 0}%)</div>
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border)" class="rounded-xl p-4 text-center">
          <div class="text-3xl font-black text-green-600">${highScore}</div>
          <div class="text-xs text-gray-500">High Score</div>
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border)" class="rounded-xl p-4 text-center">
          <div class="text-3xl font-black text-purple-600">${avgScore}</div>
          <div class="text-xs text-gray-500">Average</div>
        </div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border)" class="rounded-xl p-4 text-center mb-4">
        <div class="text-3xl font-black text-red-500">🎲 ${yahtzees}</div>
        <div class="text-xs text-gray-500">Yahtzees</div>
      </div>
    `;

  return modal(`
    <h2 class="text-2xl font-black text-white mb-1">${escapeHtml(p.name)}</h2>
    <p class="text-gray-500 text-sm mb-4">Statistics</p>
    ${statsContent}
    <button class="btn btn-gray font-medium py-3 px-4 rounded-xl w-full" onclick="S.stats=null;R()">
      Close
    </button>
  `, 'S.stats=null;R()');
}
