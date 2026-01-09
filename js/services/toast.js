/**
 * Toast Notification Service
 */

/**
 * Show a toast notification
 * @param {string} message - Message to display
 */
export function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = '<div class="toast">' + message + '</div>';
    setTimeout(() => { toast.innerHTML = ''; }, 2000);
  }
}
