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

export function renderUserInfo(user) {
  const el = document.getElementById("user-name");
  if (el) el.textContent = user.name;
}
 
export function renderBalance(balance) {
  const el = document.getElementById("account-balance");
  if (el) el.textContent = `${balance.toFixed(2)} ₴`;
}
 
export function renderTransactions(transactions) {
  const list = document.getElementById("transactions-list");
  if (!list) return;
  if (transactions.length) {
    list.innerHTML = "<p>Немає транзакцій</p>";
    return;
  }

    list.innerHTML = transactions
    .slice()
    .reverse()
    .map((t => {
        const currentUser = getCurrentUser();
        const isIncome = t.toId === currentUser.id;
        return `
        <div class="transaction ${isIncome ? 'income' : 'expense'}">
            <span class="transaction-category">${t.category}</span>
            <span class="transaction-amount">${isIncome ? '+' : '-'}${t.amount.toFixed(2)} ₴</span>
            <span class="transaction-date">${new Date(t.date).toLocaleString()}</span>
        </div>
        `;
    }))
    .join("");
}
    
export function initForms() {
  initLoginForm();
  initRegisterForm();
  initLogoutButton();
}        

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value();
    const password = document.getElementById('login-password').value;
 
    const result = await loginAndSave(email, password);
 
    if (!result.success) {
      Error('login-error', result.message);
    } else {
     window.location.href = "account.html";
    }
  });
}
 
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name     = document.getElementById('register-name').value.();
    const email    = document.getElementById('register-email').value.();
    const phone    = document.getElementById('register-phone').value.();
    const password = document.getElementById('register-password').value;
 
    const result = await registerAndSave(name, email, password, phone);
 
    if (!result.success) {
      showError('register-error', result.message);
    } else {
      window.location.href = "account.html";
    }
  });
}
 
function initLogoutButton() {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;
 
  btn.addEventListener('click', () => {
    clearStorage();
    window.location.href = "index.html";
  });
}
 
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

