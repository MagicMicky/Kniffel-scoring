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
    ? `<div class="session-info" style="margin-top:var(--space-md)">
        <span class="session-label">Play order:</span>
        <span class="session-value">${S.game.map(p => escapeHtml(p.name)).join(' → ')}</span>
       </div>`
    : '';

  const resumeButton = S.savedGame ? resumeGameSection() : '';

  return `
    <div class="container" style="min-height:100vh;padding:var(--space-xl) var(--space-md)">
      ${hamburgerButton()}
      ${sideMenu()}
      <div class="text-center" style="margin-bottom:var(--space-xl)">
        <div style="margin-bottom:var(--space-md)">
          <img src="icon-192-v2.png" alt="Kniffel"
               style="width:96px;height:96px;margin:0 auto;border-radius:var(--rMd);box-shadow:0 4px 12px rgba(0,0,0,0.3)">
        </div>
        <h1 style="font-family:var(--font-display);font-size:var(--font-size-h1);font-weight:var(--font-weight-black);color:var(--gold-primary);letter-spacing:var(--letter-spacing-tight);line-height:1">Kniffel</h1>
        <p style="font-family:var(--font-body);font-size:var(--font-size-small);color:var(--gold-muted);letter-spacing:var(--letter-spacing-wider);text-transform:uppercase;margin-top:var(--space-xs)">Craft Game Lounge</p>
      </div>
      ${savedGameBanner()}
      ${resumeButton}
      <div class="card" style="margin-bottom:var(--space-lg)">
        <div class="flex justify-between items-center" style="margin-bottom:var(--space-md)">
          <h2 class="section-title" style="margin:0;padding:0;border:none">Select Players</h2>
          <button class="btn-icon" onclick="S.mgr=true;R()">⚙️</button>
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
    <div class="text-center" style="padding:var(--space-lg) 0;color:var(--text-secondary)">
      <p style="margin-bottom:var(--space-md)">No players yet!</p>
      <button class="btn-secondary" onclick="S.mgr=true;R()">+ Add Players</button>
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

    const cardStyle = isSelected
      ? `background:linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);border:2px solid ${playerColor};box-shadow:0 2px 8px rgba(212,165,116,0.2)`
      : `background:var(--bg-tertiary);border:2px solid var(--border-primary)`;

    const orderButtons = isSelected
      ? `<button class="btn-icon-sm" onclick="event.stopPropagation();mv(${gameIndex},-1)">▲</button>
         <button class="btn-icon-sm" onclick="event.stopPropagation();mv(${gameIndex},1)">▼</button>`
      : '';

    return `
      <div class="flex items-center gap-2 p-3"
           style="${cardStyle};border-radius:var(--rSm);cursor:pointer;transition:all var(--transition-normal)"
           onclick="tog(${p.id})">
        <div class="checkbox">${isSelected ? '<div class="checkbox-inner"></div>' : ''}</div>
        <div class="color-dot" style="background:${playerColor}"></div>
        <span class="flex-1 font-medium" style="color:var(--text);font-family:var(--font-body)">${escapeHtml(p.name)}</span>
        ${orderButtons}
        <button class="btn-icon-sm" style="font-size:0.75rem"
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
    <div class="box" style="margin-bottom:var(--space-md);background:linear-gradient(135deg, rgba(230, 184, 115, 0.1) 0%, rgba(212, 165, 116, 0.05) 100%)">
      <p style="color:var(--text);font-weight:var(--font-weight-bold);margin-bottom:var(--space-xs);font-family:var(--font-body)">📌 Paused Game ${modeIcon}</p>
      <p style="color:var(--text-secondary);font-size:var(--font-size-small);font-family:var(--font-body)">${players}</p>
      <p style="color:var(--muted);font-size:var(--font-size-tiny);margin-top:var(--space-xs);font-family:var(--font-body)">${savedDate}</p>
    </div>
  `;
}

/**
 * Create resume game buttons
 */
function resumeGameSection() {
  return `
    <div class="grid grid-cols-2 gap-2" style="margin-bottom:var(--space-md)">
      <button class="btn-secondary" onclick="discardSaved()">🗑️ Discard</button>
      <button class="btn-primary" onclick="resumeGame()">▶️ Resume</button>
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
        <div class="title">Physical Dice</div>
        <div class="desc">Roll real dice • Enter scores</div>
      </button>

      <div class="expandable-mode-container">
        <button class="game-mode-btn expandable-header ${isExpanded ? 'expanded' : ''}"
                onclick="startGameWithMode('play', false)" ${disabled}>
          <div class="icon">📱</div>
          <div class="title">Virtual Dice</div>
          <div class="desc">Roll on phone • Auto-scoring</div>
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
    <div class="flex items-center gap-2 p-3" style="background:var(--bg-tertiary);border-radius:var(--rSm);border:2px solid var(--border-primary)">
      <div class="color-dot" style="background:${COLORS[i % COLORS.length]}"></div>
      <input type="text" class="input flex-1" value="${escapeHtml(p.name)}" onchange="ren(${p.id},this.value)">
      <button class="btn-danger btn-sm" onclick="del(${p.id})">Delete</button>
    </div>
  `).join('');

  return modal(`
    <h2 style="font-size:var(--font-size-h3);font-weight:var(--font-weight-black);color:var(--text);margin-bottom:var(--space-md);font-family:var(--font-body)">👥 Manage Players</h2>
    <div class="space-y-2" style="margin-bottom:var(--space-md)">${playerList}</div>
    <div class="flex gap-2" style="margin-bottom:var(--space-md)">
      <input type="text" id="np" class="input flex-1" placeholder="New player..."
             onkeypress="if(event.key==='Enter')addP()">
      <button class="btn-primary btn-sm" onclick="addP()">Add</button>
    </div>
    <button class="btn-primary w-full" onclick="S.mgr=false;save();R()">
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
    ? '<p class="text-center" style="color:var(--muted);padding:var(--space-lg) 0">No games yet</p>'
    : `
      <div class="stats">
        <div class="stat">
          <div class="stat-label">Games</div>
          <div class="stat-value">${results.length}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Wins</div>
          <div class="stat-value">${wins}</div>
        </div>
        <div class="stat">
          <div class="stat-label">High Score</div>
          <div class="stat-value">${highScore}</div>
        </div>
      </div>
      <div class="stats" style="grid-template-columns:repeat(2, 1fr)">
        <div class="stat">
          <div class="stat-label">Average</div>
          <div class="stat-value">${avgScore}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Yahtzees</div>
          <div class="stat-value">🎲 ${yahtzees}</div>
        </div>
      </div>
    `;

  return modal(`
    <h2 style="font-size:var(--font-size-h3);font-weight:var(--font-weight-black);color:var(--text);margin-bottom:var(--space-xs);font-family:var(--font-display)">${escapeHtml(p.name)}</h2>
    <p style="color:var(--text-secondary);font-size:var(--font-size-small);margin-bottom:var(--space-lg);font-family:var(--font-body)">Statistics</p>
    ${statsContent}
    <button class="btn-secondary w-full" style="margin-top:var(--space-lg)" onclick="S.stats=null;R()">
      Close
    </button>
  `, 'S.stats=null;R()');
}
