/**
 * Dice Service
 * Handles dice rolling, shake detection, and turn management
 */

import { S, resetDiceState } from '../state.js';
import { calcScore, getPossibleScores } from '../utils/scoring.js';
import { vibrate } from '../utils/helpers.js';
import { showToast } from './toast.js';
import { showFireworks } from './fireworks.js';

/**
 * Roll a single die
 * @returns {number} Random value 1-6
 */
export function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Roll all unheld dice
 * @param {Function} render - Render callback function
 */
export function rollDice(render) {
  const maxRolls = S.isBlitzMode ? 2 : 3;
  if (!S.turnStarted || S.rolling || S.rollCount >= maxRolls) return;

  // Haptic feedback
  vibrate(50);

  S.rolling = true;
  render();

  // Animate for 400ms
  let animCount = 0;
  const animInterval = setInterval(() => {
    S.dice = S.dice.map((d, i) => S.held[i] ? d : rollDie());
    render();
    animCount++;
    if (animCount >= 8) {
      clearInterval(animInterval);
      S.rolling = false;
      S.rollCount++;

      // Track dice values for fun stats (only count non-held dice that were just rolled)
      S.dice.forEach((value, i) => {
        if (!S.held[i]) {
          S.diceHistory.push(value);
        }
      });

      render();

      // Check for Yahtzee and notify
      if (calcScore(S.dice, 'yahtzee') === 50) {
        showToast('🎉 YAHTZEE!');
        showFireworks();
        vibrate([100, 50, 100]);
      }
    }
  }, 50);
}

/**
 * Toggle hold state for a die
 * @param {number} index - Die index (0-4)
 * @param {Function} render - Render callback function
 */
export function toggleHold(index, render) {
  if (S.rollCount === 0 || S.rolling) return;
  S.held[index] = !S.held[index];
  vibrate(5);
  render();
}

/**
 * Reset dice for a new turn
 */
export function resetDiceForTurn() {
  resetDiceState();
}

/**
 * Start a turn (enable rolling)
 * @param {Function} render - Render callback function
 */
export function startTurn(render) {
  S.turnStarted = true;
  vibrate(50);

  // Start timer for blitz mode
  if (S.isBlitzMode) {
    startBlitzTimer(render);
  }

  render();
}

/**
 * Start the blitz mode timer
 * @param {Function} render - Render callback function
 */
function startBlitzTimer(render) {
  S.turnStartTime = Date.now();
  S.turnTimeRemaining = 15;
  S.speedBonusEarned = false;

  // Clear any existing timer
  if (S.turnTimer) {
    clearInterval(S.turnTimer);
  }

  // Update timer every 100ms for smooth countdown
  S.turnTimer = setInterval(() => {
    const elapsed = (Date.now() - S.turnStartTime) / 1000;
    S.turnTimeRemaining = Math.max(0, 15 - elapsed);

    // Warning vibration at 10 seconds
    if (S.turnTimeRemaining <= 10 && S.turnTimeRemaining > 9.9) {
      vibrate([50, 50, 50]);
    }

    // Time's up - auto-select best score
    if (S.turnTimeRemaining <= 0) {
      clearInterval(S.turnTimer);
      S.turnTimer = null;
      autoSelectBestScore();
    }

    render();
  }, 100);
}

/**
 * Stop the blitz mode timer
 */
export function stopBlitzTimer() {
  if (S.turnTimer) {
    clearInterval(S.turnTimer);
    S.turnTimer = null;
  }
}

/**
 * Auto-select best available score when time runs out
 */
function autoSelectBestScore() {
  const currentPlayer = S.game[S.cur];

  // If player hasn't rolled at all, score 0 in first available category
  if (S.rollCount === 0) {
    const bestCategory = S.blitzCategories.find(catId => currentPlayer.scores[catId] === null);
    if (bestCategory) {
      showToast("⏰ Time's up! Auto-scoring 0...");
      vibrate([100, 50, 100]);
      setTimeout(() => {
        window.selectPlayScore(bestCategory, 0);
      }, 500);
    }
    return;
  }

  // Player has rolled - randomly select an available category
  const possibleScores = getPossibleScores(S.dice);

  // Get all available categories (not yet scored)
  const availableCategories = S.blitzCategories.filter(catId => currentPlayer.scores[catId] === null);

  if (availableCategories.length > 0) {
    // Pick a random available category
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const randomScore = possibleScores[randomCategory] !== undefined ? possibleScores[randomCategory] : 0;

    showToast("⏰ Time's up! Auto-scoring...");
    vibrate([100, 50, 100]);

    // Call the global selectPlayScore function
    setTimeout(() => {
      window.selectPlayScore(randomCategory, randomScore);
    }, 500);
  }
}

/**
 * Set up shake detection for rolling dice
 * @param {Function} rollCallback - Function to call when shake detected
 */
export function setupShakeDetection(rollCallback) {
  const SHAKE_THRESHOLD = 20;
  const SHAKE_COOLDOWN = 2000;

  if (!('DeviceMotionEvent' in window)) {
    S.shakeEnabled = false;
    return;
  }

  // iOS 13+ requires permission
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    const requestMotionPermission = async () => {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          S.shakeEnabled = true;
          addShakeListener();
        }
      } catch (e) {
        console.log('Motion permission denied:', e);
      }
      document.removeEventListener('click', requestMotionPermission);
    };
    document.addEventListener('click', requestMotionPermission, { once: true });
    showToast('Tap anywhere to enable shake');
  } else {
    S.shakeEnabled = true;
    addShakeListener();
  }

  function addShakeListener() {
    window.addEventListener('devicemotion', (e) => {
      if (S.view !== 'game' || S.mode !== 'play') return;
      const maxRolls = S.isBlitzMode ? 2 : 3;
      if (!S.turnStarted || S.rolling || S.rollCount >= maxRolls) return;

      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const total = Math.sqrt(
        (acc.x || 0) ** 2 +
        (acc.y || 0) ** 2 +
        (acc.z || 0) ** 2
      );

      const now = Date.now();
      if (total > SHAKE_THRESHOLD && now - S.lastShake > SHAKE_COOLDOWN) {
        S.lastShake = now;
        rollCallback();
      }
    });
  }
}

/**
 * Generate HTML for a die face using dots
 * @param {number} value - Die value (1-6)
 * @returns {string} HTML string for dot pattern
 */
export function dieFace(value) {
  const dots = {
    1: '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;background:var(--onAccent);border-radius:50%"></div>',
    2: '<div style="position:absolute;top:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div>',
    3: '<div style="position:absolute;top:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div>',
    4: '<div style="position:absolute;top:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;top:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div>',
    5: '<div style="position:absolute;top:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;top:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div>',
    6: '<div style="position:absolute;top:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;top:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;top:50%;left:20%;transform:translateY(-50%);width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;top:50%;right:20%;transform:translateY(-50%);width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;left:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div><div style="position:absolute;bottom:20%;right:20%;width:8px;height:8px;background:var(--onAccent);border-radius:50%"></div>'
  };
  return dots[value] || '';
}
