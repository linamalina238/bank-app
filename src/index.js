import { getCurrentUser, clearStorage } from "./storage.js";
import { eventBus } from "./eventBus.js";
import {
  renderUserInfo,
  renderBalance,
  renderTransactions,
  showDashboard,
  showAuthScreen,
  initForms,
} from "./ui.js";

function init() {
  const user = getCurrentUser();

  if (user) {
    showDashboard();
    renderUserInfo(user);
  } else {
    showAuthScreen();
  }

  initForms();

  eventBus.subscribe("user:login", (user) => {
    showDashboard();
    renderUserInfo(user);
  });

  eventBus.subscribe("user:logout", () => {
    showAuthScreen();
  });

  eventBus.subscribe("accounts:updated", (accounts) => {
    const user = getCurrentUser();
    if (!user) return;
    const account = accounts.find((acc) => acc.userId === user.id);
    if (account) renderBalance(account.balance);
  });

  eventBus.subscribe("transactions:updated", (transactions) => {
    renderTransactions(transactions);
  });
}

init();