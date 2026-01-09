/**
 * Modal Component
 * Reusable modal overlay wrapper
 */

/**
 * Create a modal wrapper
 * @param {string} content - Inner content HTML
 * @param {string} [onClose] - Click handler for closing modal
 * @param {string} [customClass] - Additional classes for modal
 * @param {string} [customStyle] - Additional inline styles
 * @returns {string} Modal HTML
 */
export function modal(content, onClose = '', customClass = '', customStyle = '') {
  const closeHandler = onClose ? `onclick="${onClose}"` : '';
  return `
    <div class="modal-overlay" ${closeHandler}>
      <div class="modal ${customClass}" onclick="event.stopPropagation()" style="${customStyle}">
        ${content}
      </div>
    </div>
  `;
}

/**
 * Create a confirmation modal
 * @param {Object} options - Modal options
 * @param {string} options.icon - Emoji icon
 * @param {string} options.title - Modal title
 * @param {string} options.message - Main message
 * @param {string} [options.submessage] - Secondary message
 * @param {Array} options.buttons - Array of button configs {text, class, onclick}
 * @returns {string} Modal HTML
 */
export function confirmModal({ icon, title, message, submessage = '', buttons }) {
  const buttonsHtml = buttons.map(btn =>
    `<button class="btn ${btn.class} font-${btn.fontWeight || 'bold'} py-${btn.padding || 4} px-4 rounded-xl w-full ${btn.textSize || 'text-lg'}" onclick="${btn.onclick}">${btn.text}</button>`
  ).join('');

  return modal(`
    <div class="text-center mb-4">
      <div class="text-5xl mb-3">${icon}</div>
      <h3 class="text-2xl font-black text-gray-800 mb-2">${title}</h3>
      <p class="text-gray-600">${message}</p>
      ${submessage ? `<p class="text-gray-500 text-sm">${submessage}</p>` : ''}
    </div>
    <div class="flex flex-col gap-3">
      ${buttonsHtml}
    </div>
  `, 'event.stopPropagation()');
}
