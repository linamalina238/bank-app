import { getCurrentUser } from './storage.js';
import { initForms } from './ui.js';
 
if (getCurrentUser()) {
  window.location.href = 'account.html';
}

initForms();

['login-form', 'register-form'].forEach(id => {
  document.getElementById(id)?.addEventListener('submit', () => {
    setTimeout(() => {
      if (getCurrentUser()) window.location.href = 'account.html';
    }, 600);
  });
});