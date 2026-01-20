/**
 * Setup View
 * Main setup/home screen
 * REFACTORED: Uses component system, removed inline styles
 */

import { S } from '../state.js';
import { COLORS } from '../constants.js';
import { escapeHtml } from '../utils/helpers.js';
import { hamburgerButton, sideMenu } from './components/sideMenu.js';
import { modal } from './components/modal.js';
import { upTot, grand, upBonus, loTot } from '../utils/scoring.js';
import { Button, InfoBox, PageHeader } from '../components/ui.js';

/**
 * Render the setup view
 * @returns {string} HTML string
 */
export function setupView() {
  const playerList = S.known.length === 0
    ? noPlayersMessage()
    : playerSelectionList();

  const playOrder = S.game.length > 0
    ? `<div class="session-info">
        <span class="session-label">Play order:</span>
        <span class="session-value">${S.game.map(p => escapeHtml(p.name)).join(' → ')}</span>
       </div>`
    : '';

  const resumeButton = S.savedGame ? resumeGameSection() : '';

  return `
    <div class="app-layout">
      ${hamburgerButton()}
      ${sideMenu()}

      <!-- Fixed Header -->
      <div class="app-layout-header">
        ${PageHeader({
          title: 'SCHNITZEL',
          subtitle: 'Your Travel Yahtzee Companion',
          showLogo: true,
          compact: true
        })}
      </div>

      <!-- Scrollable Content -->
      <div class="app-layout-content">
        ${savedGameBanner()}
        ${resumeButton}
        <div class="card card-compact">
          <div class="flex justify-between items-center mb-sm">
            <h2 class="card-title">Select Players</h2>
            ${Button({ icon: '⚙️', variant: 'icon', onClick: 'S.mgr=true;R()' })}
          </div>
          <div class="player-list-compact space-y-2">${playerList}</div>
          ${playOrder}
        </div>
      </div>

      <!-- Fixed Actions -->
      <div class="app-layout-actions">
        ${gameModeButtons()}
      </div>
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
    <div class="no-players-msg">
      <p class="mb-md">No players yet!</p>
      ${Button({ text: '+ Add Players', variant: 'secondary', onClick: 'S.mgr=true;R()' })}
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

    const rowClasses = [
      'player-row',
      'player-row-clickable',
      isSelected ? 'player-row-selected' : ''
    ].filter(Boolean).join(' ');

    // Add border-color inline only (dynamic player color)
    const borderStyle = isSelected ? `border-color:${playerColor}` : '';

    const orderButtons = isSelected
      ? `${Button({ icon: '▲', variant: 'icon-sm', onClick: `event.stopPropagation();mv(${gameIndex},-1)` })}
         ${Button({ icon: '▼', variant: 'icon-sm', onClick: `event.stopPropagation();mv(${gameIndex},1)` })}`
      : '';

    return `
      <div class="${rowClasses}"
           style="${borderStyle}"
           onclick="tog(${p.id})">
        <div class="checkbox">${isSelected ? '<div class="checkbox-inner"></div>' : ''}</div>
        <div class="color-dot" style="background:${playerColor}"></div>
        <span class="flex-1 font-medium player-name-text">${escapeHtml(p.name)}</span>
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

  return InfoBox({
    title: `Paused Game ${modeIcon}`,
    icon: '📌',
    subtitle: players,
    meta: savedDate,
    variant: 'default',
    compact: true
  });
}

/**
 * Create resume game buttons
 */
function resumeGameSection() {
  return `
    <div class="grid grid-cols-2 gap-2 mb-compact">
      ${Button({ text: 'Discard', icon: '🗑️', variant: 'secondary', onClick: 'discardSaved()' })}
      ${Button({ text: 'Resume', icon: '▶️', variant: 'primary', onClick: 'resumeGame()' })}
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
    <div class="mode-select-compact">
      <button class="game-mode-btn-compact" onclick="startGameWithMode('score')" ${disabled}>
        <div class="icon">🎲</div>
        <div class="title">Physical Dice</div>
        <div class="desc">Roll real dice • Enter scores</div>
      </button>

      <div class="expandable-mode-compact">
        <button class="game-mode-btn-compact expandable-header ${isExpanded ? 'expanded' : ''}"
                onclick="startGameWithMode('play', false)" ${disabled}>
          <div class="icon">📱</div>
          <div class="title">Virtual Dice</div>
          <div class="desc">Roll on phone • Auto-scoring</div>
          <span class="expand-icon" onclick="event.stopPropagation();toggleVirtualDiceExpanded()">${expandIcon}</span>
        </button>

        <div class="expandable-content ${isExpanded ? 'expanded' : ''}">
          <button class="mode-variant-btn-compact"
                  onclick="startGameWithMode('play', false)" ${disabled}>
            <div class="variant-icon">📱</div>
            <div class="variant-info">
              <div class="variant-title">Standard Game</div>
              <div class="variant-desc">3 rolls • All 13 categories</div>
            </div>
          </button>

          <button class="mode-variant-btn-compact"
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
    <div class="player-row">
      <div class="color-dot" style="background:${COLORS[i % COLORS.length]}"></div>
      <input type="text" class="input input-compact flex-1" value="${escapeHtml(p.name)}" onchange="ren(${p.id},this.value)">
      ${Button({ text: 'Delete', variant: 'danger', size: 'sm', onClick: `del(${p.id})` })}
    </div>
  `).join('');

  return modal(`
    <h2 class="modal-title">👥 Manage Players</h2>
    <div class="space-y-2 mb-md">${playerList}</div>
    <div class="player-row mb-md">
      <input type="text" id="np" class="input input-compact flex-1" placeholder="New player..."
             onkeypress="if(event.key==='Enter')addP()">
      ${Button({ text: 'Add', variant: 'primary', size: 'sm', onClick: 'addP()' })}
    </div>
    ${Button({ text: 'Done', variant: 'primary', className: 'w-full', onClick: 'S.mgr=false;save();R()' })}
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
    ? '<p class="text-center text-secondary p-lg">No games yet</p>'
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
      <div class="stats stats-grid-2col">
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
    <h2 class="modal-title font-display">${escapeHtml(p.name)}</h2>
    <p class="modal-subtitle">Statistics</p>
    ${statsContent}
    ${Button({ text: 'Close', variant: 'secondary', className: 'w-full mt-lg', onClick: 'S.stats=null;R()' })}
  `, 'S.stats=null;R()');
}
