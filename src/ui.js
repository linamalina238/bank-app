let toastTimer = null;
 
export function showToast(message, type = 'info') {
  const toast  = document.getElementById('povidomlennya');
  const icon   = document.getElementById('toastIkona');
  const text   = document.getElementById('toastTekst');
 
  if (!toast || !icon || !text) return;
 
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
 
  icon.textContent = icons[type] ?? icons.info;
  text.textContent = message;
 
  toast.className = `toast toast--${type} toast--visible`;
 
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 3000);
}