import { getCurrentUser, getAccounts } from "./storage.js";
import { handleLogin, handleRegister, handleLogout, isAuthenticated } from "./auth.js";
import { deposit, withdraw } from "./account.js";
import { addTransaction, transfer, getHistory, getByCategory } from "./transactions.js";

// ============================================================
// TOAST
// ============================================================
export function showToast(text, type = "info") {
  const toast     = document.getElementById("povidomlennya");
  const toastText = document.getElementById("toastTekst");
  const toastIcon = document.getElementById("toastIkona");
  if (!toast) return;
  toastText.textContent = text;
  toastIcon.textContent = type === "error" ? "✕" : "✓";
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ============================================================
// НАВІГАЦІЯ: перемикання між loginPage / mainPage
// ============================================================
export function showPage(pageId) {
  // login / main — звичайний display
  ["loginPage", "mainPage"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = id === pageId
      ? (id === "mainPage" ? "block" : "flex")
      : "none";
  });

  if (pageId === "mainPage") {
    renderBalanceCard();
    renderTransactions();
    showTab("tab-dashboard");
  }
}

// ============================================================
// ВКЛАДКИ всередині mainPage
// ============================================================
export function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(t => { t.style.display = "none"; });
  document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));

  const tab = document.getElementById(tabId);
  if (tab) tab.style.display = "block";

  const btn = document.querySelector(`[data-tab="${tabId}"]`);
  if (btn) btn.classList.add("active");
}

// ============================================================
// ПЕРЕМИКАЧ форм логін / реєстрація
// ============================================================
export function showAuthForm(which) {
  const loginForm    = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const btnLogin     = document.getElementById("btnSwitchLogin");
  const btnRegister  = document.getElementById("btnSwitchRegister");

  if (which === "login") {
    loginForm.style.display    = "block";
    registerForm.style.display = "none";
    btnLogin?.classList.add("active");
    btnRegister?.classList.remove("active");
  } else {
    loginForm.style.display    = "none";
    registerForm.style.display = "block";
    btnLogin?.classList.remove("active");
    btnRegister?.classList.add("active");
  }
}

// ============================================================
// БАЛАНС
// ============================================================
export function renderBalanceCard() {
  const user = getCurrentUser();
  if (!user) return;

  const nameEl   = document.getElementById("showUserName");
  const avatarEl = document.getElementById("avatarLitera");
  const balansEl = document.getElementById("balans");

  if (nameEl)   nameEl.textContent   = user.name;
  if (avatarEl) avatarEl.textContent = user.name?.[0]?.toUpperCase() || "U";

  const account = getAccounts().find(a => a.userId === user.id);
  if (balansEl) balansEl.textContent = (account?.balance ?? 0).toFixed(2);
}

// ============================================================
// ТРАНЗАКЦІЇ — рендер списку
// ============================================================
export function renderTransactions(filter = "Всі") {
  const list = document.getElementById("spysokTransakciy");
  if (!list) return;

  const txs = filter === "Всі" ? getHistory() : getByCategory(filter);

  if (txs.length === 0) {
    list.innerHTML = `<div class="emptyMsg"><div class="bigEmoji">💸</div><p>Транзакцій немає</p></div>`;
    return;
  }

  const icons = { Їжа:"🍔", Транспорт:"🚗", Розваги:"🎮", "Здоровʼя":"💊", Зарплата:"💰", Комунальні:"🏠", переказ:"🔄", Інше:"📦" };

  list.innerHTML = [...txs].reverse().map(tx => {
    const isIncome  = tx.type === "income" || tx.toId === getCurrentUser()?.id;
    const typeClass = isIncome ? "income" : "expense";
    const sign      = isIncome ? "+" : "−";
    return `
      <div class="txItem">
        <div class="txIcon ${typeClass}">${icons[tx.category] || "📦"}</div>
        <div class="txInfo">
          <div class="txName">${tx.description || tx.category}</div>
          <div class="txMeta">${tx.date?.slice(0,10)} · ${tx.category}</div>
        </div>
        <span class="txSum ${typeClass}">${sign}${Number(tx.amount).toFixed(2)} ₴</span>
        <button class="delBtn" data-id="${tx.id}">✕</button>
      </div>`;
  }).join("");

  // Статистика місяця
  const thisMonth = new Date().toISOString().slice(0, 7);
  const all       = getHistory().filter(t => t.date?.startsWith(thisMonth));
  const income    = all.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense   = all.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const incEl = document.getElementById("vsiDokhody");
  const expEl = document.getElementById("vsiVytraty");
  if (incEl) incEl.textContent = `₴${income.toFixed(2)}`;
  if (expEl) expEl.textContent = `₴${expense.toFixed(2)}`;
}

// ============================================================
// МОДАЛ поповнення / списання
// ============================================================
let _modalType = null;

export function openModal(type) {
  _modalType = type;
  const modal     = document.getElementById("modalVikno");
  const zaholovok = document.getElementById("modalZaholovok");
  const input     = document.getElementById("modalSuma");
  if (!modal) return;
  if (zaholovok) zaholovok.textContent = type === "topup" ? "Поповнення" : "Списання";
  if (input) input.value = "";
  modal.classList.add("vidkryty");
}

export function closeModal() {
  document.getElementById("modalVikno")?.classList.remove("vidkryty");
  _modalType = null;
}

export function confirmModal() {
  const suma = parseFloat(document.getElementById("modalSuma")?.value);
  if (!suma || suma <= 0) { showToast("Введіть коректну суму", "error"); return; }

  const ok = _modalType === "topup" ? deposit(suma) : withdraw(suma);

  if (ok) {
    showToast(_modalType === "topup" ? `Поповнено на ${suma} ₴` : `Списано ${suma} ₴`, "success");
    renderBalanceCard();
    renderTransactions();
  } else {
    showToast("Помилка операції", "error");
  }
  closeModal();
}

// ============================================================
// ФОРМА НОВОЇ ТРАНЗАКЦІЇ
// ============================================================
let _txType = "income";

export function showTxForm() {
  document.getElementById("formaTransakciyi")?.classList.add("pokazaty");
  const input = document.getElementById("data");
  if (input) input.value = new Date().toISOString().split("T")[0];
}

export function hideTxForm() {
  document.getElementById("formaTransakciyi")?.classList.remove("pokazaty");
}

export function setTxType(type) {
  _txType = type;
  document.getElementById("btnDokhid")?.classList.toggle("activeIncome",  type === "income");
  document.getElementById("btnVytrata")?.classList.toggle("activeExpense", type === "expense");
}

export function saveTx() {
  const suma      = parseFloat(document.getElementById("suma")?.value);
  const kategoria = document.getElementById("kategoria")?.value;
  const data      = document.getElementById("data")?.value;
  const opys      = document.getElementById("opys")?.value?.trim() || kategoria;

  if (!suma || suma <= 0) { showToast("Введіть коректну суму", "error"); return; }
  if (!data)              { showToast("Оберіть дату", "error"); return; }

  // Оновлюємо баланс
  const ok = _txType === "income" ? deposit(suma) : withdraw(suma);
  if (!ok) { showToast("Недостатньо коштів", "error"); return; }

  addTransaction(_txType, suma, kategoria, opys);
  showToast("Транзакцію збережено!", "success");
  hideTxForm();
  renderBalanceCard();
  renderTransactions();
}

// ============================================================
// ВИДАЛЕННЯ транзакції
// ============================================================
export function deleteTx(id) {
  const all     = JSON.parse(localStorage.getItem("bank_transactions") || "[]");
  const updated = all.filter(t => String(t.id) !== String(id));
  localStorage.setItem("bank_transactions", JSON.stringify(updated));
  import("./storage.js").then(m => m.getTransactions.clear?.());
  showToast("Транзакцію видалено", "success");
  renderTransactions();
}

// ============================================================
// ІНІЦІАЛІЗАЦІЯ ВСІХ СЛУХАЧІВ ПОДІЙ
// ============================================================
export function initUI() {
  // --- Авторизація ---
  document.getElementById("btnSwitchLogin")
    ?.addEventListener("click", () => showAuthForm("login"));
  document.getElementById("btnSwitchRegister")
    ?.addEventListener("click", () => showAuthForm("register"));
  document.getElementById("btnVhid")
    ?.addEventListener("click", handleLogin);
  document.getElementById("btnReestraciya")
    ?.addEventListener("click", handleRegister);
  document.getElementById("vhidParol")
    ?.addEventListener("keydown", e => { if (e.key === "Enter") handleLogin(); });
  document.getElementById("regParol")
    ?.addEventListener("keydown", e => { if (e.key === "Enter") handleRegister(); });

  // index.html (welcome screen)
  document.getElementById("btn-login")
    ?.addEventListener("click", handleLogin);
  document.getElementById("btn-register")
    ?.addEventListener("click", handleRegister);

  // --- Вихід ---
  document.getElementById("btnVyhid")
    ?.addEventListener("click", handleLogout);

  // --- Вкладки ---
  document.querySelectorAll(".nav-tab").forEach(btn =>
    btn.addEventListener("click", () => showTab(btn.dataset.tab))
  );

  // --- Баланс: поповнити / списати ---
  document.getElementById("btnTopup")
    ?.addEventListener("click", () => openModal("topup"));
  document.getElementById("btnWithdraw")
    ?.addEventListener("click", () => openModal("withdraw"));

  // --- Модал ---
  document.getElementById("btnCancelModal")
    ?.addEventListener("click", closeModal);
  document.getElementById("btnConfirmModal")
    ?.addEventListener("click", confirmModal);
  document.getElementById("modalVikno")
    ?.addEventListener("click", e => { if (e.target.id === "modalVikno") closeModal(); });

  // --- Форма транзакції ---
  document.getElementById("btnShowForm")
    ?.addEventListener("click", showTxForm);
  document.getElementById("btnCloseForm")
    ?.addEventListener("click", hideTxForm);
  document.getElementById("btnSaveTransaction")
    ?.addEventListener("click", saveTx);
  document.getElementById("btnDokhid")
    ?.addEventListener("click", () => setTxType("income"));
  document.getElementById("btnVytrata")
    ?.addEventListener("click", () => setTxType("expense"));

  // --- Фільтри (делегування) ---
  document.getElementById("filtersRow")
    ?.addEventListener("click", e => {
      const btn = e.target.closest(".filterBtn");
      if (!btn) return;
      document.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTransactions(btn.dataset.filter);
    });

  // --- Видалення транзакції (делегування) ---
  document.getElementById("spysokTransakciy")
    ?.addEventListener("click", e => {
      const btn = e.target.closest(".delBtn");
      if (btn?.dataset.id) deleteTx(btn.dataset.id);
    });
}