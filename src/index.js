import { getCurrentUser, getAccounts } from "./storage.js";
import { isAuthenticated } from "./auth.js";
import { showPage, initUI, showToast } from "./ui.js";
import { createAccount } from "./account.js";
import { eventBus } from "./eventBus.js";

// Ініціалізуємо всі слухачі подій
initUI();

// Слухаємо події з storage
eventBus.subscribe("user:login", (user) => {
  // Створити рахунок якщо його ще немає
  const { hasAccount } = import("./account.js");
  import("./account.js").then(m => {
    if (!m.hasAccount(user.id)) m.createAccount(user.id);
  });
});

eventBus.subscribe("user:logout", () => {
  showPage("loginPage");
});

eventBus.subscribe("accounts:updated", () => {
  import("./ui.js").then(m => m.renderBalanceCard());
});

eventBus.subscribe("transactions:updated", () => {
  import("./ui.js").then(m => m.renderTransactions());
});

// Стартова сторінка: якщо вже залогінений — одразу mainPage
if (isAuthenticated()) {
  showPage("mainPage");
} else {
  showPage("loginPage");
}