import { loginAndSave, registerAndSave, clearStorage } from "./storage.js";
import { getAccounts, getTransactions, getCurrentUser } from "./storage.js";
 
export function showDashboard() {
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("dashboard-screen").style.display = "block";
   
  const user = getCurrentUser();
    if (!user) return;

    const account = getAccounts();
    const account = accounts.find((acc) => acc.userId === user.id); 
    renderTransactions(getTransactions());
}    
 
export function showAuthScreen() {
  document.getElementById("dashboard-screen").style.display = "none";
  document.getElementById("auth-screen").style.display = "block";
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

import { deposit, withdraw } from './account.js';
import { transfer } from './transactions.js';
 
function initDepositForm() {
  const form = document.getElementById('deposit-form');
  if (!form) return;
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError('deposit-error');
 
    const amount = parseFloat(document.getElementById('deposit-amount')?.value);
    if (!amount || amount <= 0) {
      showFormError('deposit-error', 'Введіть коректну суму');
      return;
    }
 
    const result = await deposit(amount);
 
    if (result.success) {
      form.reset();
      form.classList.add('hidden');
      showToast(`Поповнено на ${amount.toFixed(2)} ₴`, 'success');
    } else {
      showFormError('deposit-error', result.message || 'Помилка поповнення');
      showToast(result.message || 'Помилка поповнення', 'error');
    }
  });
}
 
function initWithdrawForm() {
  const form = document.getElementById('withdraw-form');
  if (!form) return;
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError('withdraw-error');
 
    const amount = parseFloat(document.getElementById('withdraw-amount')?.value);
    if (!amount || amount <= 0) {
      showFormError('withdraw-error', 'Введіть коректну суму');
      return;
    }
 
    const result = await withdraw(amount);
 
    if (result.success) {
      form.reset();
      form.classList.add('hidden');
      showToast(`Знято ${amount.toFixed(2)} ₴`, 'success');
    } else {
      showFormError('withdraw-error', result.message || 'Помилка зняття');
      showToast(result.message || 'Помилка зняття', 'error');
    }
  });
}
 
function initTransferForm() {
  const form = document.getElementById('transfer-form');
  if (!form) return;
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError('transfer-error');
 
    const toUserId = document.getElementById('transfer-to')?.value.trim();
    const amount   = parseFloat(document.getElementById('transfer-amount')?.value);
 
    if (!toUserId) {
      showFormError('transfer-error', 'Введіть ID отримувача');
      return;
    }
    if (!amount || amount <= 0) {
      showFormError('transfer-error', 'Введіть коректну суму');
      return;
    }
 
    const result = await transfer(toUserId, amount);
 
    if (result.success) {
      form.reset();
      form.classList.add('hidden');
      showToast(`Переказано ${amount.toFixed(2)} ₴`, 'success');
    } else {
      showFormError('transfer-error', result.message || 'Помилка переказу');
      showToast(result.message || 'Помилка переказу', 'error');
    }
  });
}

export function initForms() {
  initLoginForm();
  initRegisterForm();
  initLogoutButton();
}