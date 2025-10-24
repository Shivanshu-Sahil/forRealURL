import toast from 'react-hot-toast';

/**
 * Copy text to clipboard with toast notification
 * @param {string} text - Text to copy to clipboard
 * @param {string} message - Success message to display (optional)
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const copyToClipboard = async (text, message = '✓ Copied to clipboard!') => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message, {
      duration: 2000,
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #f97316',
      },
      iconTheme: {
        primary: '#f97316',
        secondary: '#fff',
      },
    });
    return true;
  } catch (err) {
    toast.error('Failed to copy!', {
      duration: 2000,
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #ef4444',
      },
    });
    console.error('Failed to copy:', err);
    return false;
  }
};
