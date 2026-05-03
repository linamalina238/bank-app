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

import { handleLogin, handleRegister } from './auth.js';
 
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError('login-error');
 
    const email    = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
 
    setFormLoading(form, true);
    const result = await handleLogin(email, password);
    setFormLoading(form, false);
 
    if (result.success) {
      showToast('Вхід успішний!', 'success');
    } else {
      showFormError('login-error', result.message || 'Помилка входу');
      showToast(result.message || 'Помилка входу', 'error');
    }
  });
}
 
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError('register-error');
 
    const name     = document.getElementById('register-name')?.value.trim();
    const email    = document.getElementById('register-email')?.value.trim();
    const phone    = document.getElementById('register-phone')?.value.trim();
    const password = document.getElementById('register-password')?.value;
 
    setFormLoading(form, true);
    const result = await handleRegister(name, email, password, phone);
    setFormLoading(form, false);
 
    if (result.success) {
      showToast('Акаунт створено!', 'success');
    } else {
      showFormError('register-error', result.message || 'Помилка реєстрації');
      showToast(result.message || 'Помилка реєстрації', 'error');
    }
  });
}