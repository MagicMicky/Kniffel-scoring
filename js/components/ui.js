/**
 * Atomic UI Components
 * Reusable building blocks for the Kniffel PWA
 */

import { escapeHtml } from '../utils/helpers.js';

/**
 * Button Component
 * @param {Object} options
 * @param {string} options.text - Button text
 * @param {string} [options.icon] - Optional emoji/icon
 * @param {string} [options.variant='primary'] - 'primary' | 'secondary' | 'danger' | 'text' | 'icon' | 'icon-sm'
 * @param {string} [options.size='md'] - 'sm' | 'md' | 'lg'
 * @param {boolean} [options.disabled=false] - Disabled state
 * @param {string} [options.onClick=''] - Click handler name
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Button({
  text = '',
  icon = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick = '',
  className = ''
}) {
  const classes = [
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    disabled ? 'disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const onClickAttr = onClick && !disabled ? `onclick="${onClick}"` : '';
  const disabledAttr = disabled ? 'disabled' : '';

  // Icon-only buttons
  if (variant === 'icon' || variant === 'icon-sm') {
    return `<button class="${classes}" ${onClickAttr} ${disabledAttr}>${icon}</button>`;
  }

  // Text with optional icon
  const iconHtml = icon ? `${icon} ` : '';
  const buttonText = escapeHtml(text);

  return `<button class="${classes}" ${onClickAttr} ${disabledAttr}>${iconHtml}${buttonText}</button>`;
}

/**
 * Card Component
 * @param {Object} options
 * @param {string} [options.title] - Optional card title
 * @param {string} options.children - HTML content
 * @param {string} [options.className=''] - Additional classes
 * @param {boolean} [options.noPadding=false] - Remove default padding
 * @returns {string} HTML string
 */
export function Card({
  title = '',
  children,
  className = '',
  noPadding = false
}) {
  const classes = [
    'card',
    noPadding ? 'card-no-padding' : '',
    className
  ].filter(Boolean).join(' ');

  const titleHtml = title
    ? `<div class="card-header"><h3 class="section-title">${escapeHtml(title)}</h3></div>`
    : '';

  return `
    <div class="${classes}">
      ${titleHtml}
      <div class="card-content">${children}</div>
    </div>
  `;
}

/**
 * Section Component
 * Section header with optional progress indicator
 * @param {Object} options
 * @param {string} options.title - Section title (auto-uppercased)
 * @param {string} [options.subtitle] - Optional subtitle
 * @param {Object} [options.progress] - { current: number, total: number }
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Section({
  title,
  subtitle = '',
  progress = null,
  className = ''
}) {
  const classes = ['section-header', className].filter(Boolean).join(' ');

  const progressHtml = progress
    ? `<span class="section-progress">${progress.current}/${progress.total}</span>`
    : '';

  const subtitleHtml = subtitle
    ? `<span class="section-subtitle">${escapeHtml(subtitle)}</span>`
    : '';

  return `
    <div class="${classes}">
      <h3 class="section-title">
        ${escapeHtml(title)}
        ${progressHtml}
      </h3>
      ${subtitleHtml}
    </div>
  `;
}

/**
 * Badge Component
 * Mode badges, status indicators
 * @param {Object} options
 * @param {string} options.text - Badge text
 * @param {string} [options.icon] - Optional icon
 * @param {string} [options.variant='unknown'] - 'play' | 'score' | 'blitz' | 'unknown'
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Badge({
  text,
  icon = '',
  variant = 'unknown',
  className = ''
}) {
  const classes = [
    'mode-badge',
    `mode-badge-${variant}`,
    className
  ].filter(Boolean).join(' ');

  const iconHtml = icon ? `<span class="badge-icon">${icon}</span>` : '';

  return `<span class="${classes}">${iconHtml}${escapeHtml(text)}</span>`;
}

/**
 * InfoBox Component
 * Informational box for notifications, saved game banners, etc.
 * @param {Object} options
 * @param {string} options.title - Box title
 * @param {string} [options.subtitle] - Optional subtitle
 * @param {string} [options.meta] - Optional metadata text (small, muted)
 * @param {string} [options.icon] - Optional emoji icon
 * @param {string} [options.variant='default'] - 'default' | 'warning' | 'success' | 'danger'
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function InfoBox({
  title,
  subtitle = '',
  meta = '',
  icon = '',
  variant = 'default',
  className = ''
}) {
  const classes = [
    'info-box',
    `info-box-${variant}`,
    className
  ].filter(Boolean).join(' ');

  const iconHtml = icon ? `<span class="info-icon">${icon}</span>` : '';
  const subtitleHtml = subtitle ? `<p class="info-subtitle">${escapeHtml(subtitle)}</p>` : '';
  const metaHtml = meta ? `<p class="info-meta">${escapeHtml(meta)}</p>` : '';

  return `
    <div class="${classes}">
      <p class="info-title">${iconHtml}${escapeHtml(title)}</p>
      ${subtitleHtml}
      ${metaHtml}
    </div>
  `;
}

/**
 * Grid Component
 * Simple grid layout helper
 * @param {Object} options
 * @param {number} [options.cols=2] - Number of columns (2, 3, 6)
 * @param {string} [options.gap='gap-2'] - Gap class ('gap-2', 'gap-3')
 * @param {string} options.children - HTML content
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function Grid({
  cols = 2,
  gap = 'gap-2',
  children,
  className = ''
}) {
  const classes = [
    'grid',
    `grid-cols-${cols}`,
    gap,
    className
  ].filter(Boolean).join(' ');

  return `<div class="${classes}">${children}</div>`;
}

/**
 * PageHeader Component
 * Unified header for all pages
 * @param {Object} options
 * @param {string} [options.title='SCHNITZEL'] - Page title
 * @param {string} [options.subtitle] - Optional subtitle/tagline
 * @param {string} [options.backButton] - Back button onclick handler (if omitted, no back button)
 * @param {string} [options.rightButton] - Right button config { text, onClick, variant }
 * @param {boolean} [options.showLogo=false] - Show logo icon (only for home page)
 * @param {string} [options.className=''] - Additional classes
 * @returns {string} HTML string
 */
export function PageHeader({
  title = 'SCHNITZEL',
  subtitle = '',
  backButton = '',
  rightButton = null,
  showLogo = false,
  className = ''
}) {
  const classes = ['page-header', className].filter(Boolean).join(' ');

  // Home page style (with logo)
  if (showLogo) {
    return `
      <div class="${classes}">
        <div class="app-header">
          <div>
            <img src="icon-192-v2.png" alt="SCHNITZEL" class="app-logo">
          </div>
          <h1 class="app-title">${escapeHtml(title)}</h1>
          ${subtitle ? `<p class="app-tagline">${escapeHtml(subtitle)}</p>` : ''}
        </div>
      </div>
    `;
  }

  // Inner page style (simple header bar)
  const leftButton = backButton
    ? Button({ text: '← Back', variant: 'text', onClick: backButton, className: 'text-gold' })
    : '<div class="header-spacer"></div>';

  const rightButtonHtml = rightButton
    ? Button({
        text: rightButton.text,
        variant: rightButton.variant || 'primary',
        size: rightButton.size || 'sm',
        onClick: rightButton.onClick
      })
    : '<div class="header-spacer"></div>';

  return `
    <div class="${classes}">
      <div class="page-header-bar">
        ${leftButton}
        <h1 class="page-title">${title}</h1>
        ${rightButtonHtml}
      </div>
    </div>
  `;
}
