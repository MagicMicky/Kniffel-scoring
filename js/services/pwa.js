/**
 * PWA Service
 * Handles service worker registration and update detection
 */

import { S } from '../state.js';

/**
 * Register service worker and set up update handling
 */
export function initPWA() {
  if (!('serviceWorker' in navigator)) return;

  let refreshing = false;

  // Reload page when new service worker takes over
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  navigator.serviceWorker.register('sw.js').then(reg => {
    // Check for updates periodically
    setInterval(() => {
      reg.update();
    }, 60000);

    // Handle updates
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdatePrompt();
        }
      });
    });
  }).catch(err => console.log('SW registration failed:', err));
}

/**
 * Show update available banner
 */
function showUpdatePrompt() {
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:var(--accent);color:var(--text);padding:1rem;text-align:center;z-index:1000;box-shadow:0 2px 8px rgba(0,0,0,0.3);border-bottom:1px solid var(--accentDark);';
  banner.innerHTML = '<div style="max-width:28rem;margin:0 auto;"><strong>🎉 Update Available!</strong><br><small>A new version is ready. Your data is safe.</small><br><button style="margin-top:0.5rem;background:var(--text);color:var(--bg);border:none;padding:0.5rem 1.5rem;border-radius:0.5rem;font-weight:bold;cursor:pointer;" onclick="window.location.reload()">Update Now</button> <button style="margin-top:0.5rem;background:transparent;color:var(--text);border:1px solid var(--text);padding:0.5rem 1rem;border-radius:0.5rem;cursor:pointer;" onclick="this.parentElement.parentElement.remove()">Later</button></div>';
  document.body.appendChild(banner);
}

/**
 * Force update by unregistering service workers and clearing caches
 */
export async function forceUpdate() {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    window.location.reload(true);
  } catch (error) {
    window.location.reload(true);
  }
}

/**
 * Load version info from version.json
 * @param {Function} render - Render callback function
 */
export function loadVersion(render) {
  fetch('version.json')
    .then(res => res.json())
    .then(data => {
      S.version = `v${data.version} (${data.commit})`;
      render();
    })
    .catch(() => {
      S.version = 'v1.0.0';
      render();
    });
}
