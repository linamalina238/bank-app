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

function setFormLoading(form, loading) {
  const btn     = form.querySelector('.btn-submit');
  const label   = form.querySelector('.btn-label');
  const spinner = form.querySelector('.spinner');
 
  if (!btn) return;
 
  btn.disabled = loading;
  if (label)   label.style.opacity  = loading ? '0' : '1';
  if (spinner) spinner.style.opacity = loading ? '1' : '0';
}
 
function showFormError(errorId, message) {
  const el = document.getElementById(errorId);
  if (el) el.textContent = message;
}
 
function clearFormError(errorId) {
  const el = document.getElementById(errorId);
  if (el) el.textContent = '';
}