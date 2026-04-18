import { memoize } from "./memoize.js";
import { loginUser, registerUser, getInitData } from "./api.js";
import { eventBus } from "./eventBus.js";

async function successAuth(user) {
  saveCurrentUser(user);

  const data = await getInitData();

  saveAccounts({ userId: user.id, balance: data.balance });
  data.transactions.forEach((t) => saveTransaction(t));

  eventBus.emit("user:login", user);
}

export async function loginAndSave(email, password) {
  const result = await loginUser(email, password);

  if (result.success) {
    await successAuth(result.user);
  }
  return result;
}

export async function registerAndSave(name, email, password, phone) {
  const result = await registerUser(name, email, password, phone);

  if (result.success) {
    await successAuth(result.user);
  }
  return result;
}

// Користувачі
export function saveCurrentUser(user) {
  try {
    localStorage.setItem("bank_current_user", JSON.stringify(user));

    getCurrentUser.clear();
  } catch (error) {
    console.error("Помилка збереження поточного користувача", error);
  }
}

export const getUsers = memoize(
  function () {
    try {
      const storedUsers = localStorage.getItem("bank_users");
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error("Помилка читання користувачів", error);
      return [];
    }
  },
  { ttl: 60000 },
);

export const getCurrentUser = memoize(
  function () {
    try {
      const storedUsers = localStorage.getItem("bank_current_user");
      return storedUsers ? JSON.parse(storedUsers) : null;
    } catch (error) {
      console.error("Помилка читання поточного користувача", error);
      return null;
    }
  },
  { ttl: 60000 },
);

// Транзакції
export function saveTransaction(transaction) {
  try {
    const storedTransactions = localStorage.getItem("bank_transactions");
    const existingTransactions = storedTransactions
      ? JSON.parse(storedTransactions)
      : [];
    existingTransactions.push(transaction);
    localStorage.setItem(
      "bank_transactions",
      JSON.stringify(existingTransactions),
    );

    getTransactions.clear();

    eventBus.emit("transactions:updated", existingTransactions);
  } catch (error) {
    console.error("Помилка збереження транзакції", error);
  }
}

export const getTransactions = memoize(
  function () {
    try {
      const storedTransactions = localStorage.getItem("bank_transactions");
      return storedTransactions ? JSON.parse(storedTransactions) : [];
    } catch (error) {
      console.error("Помилка читання транзакції", error);
      return [];
    }
  },
  { ttl: 60000 },
);

// Рахунки
export function saveAccounts(account) {
  try {
    const storedAccounts = localStorage.getItem("bank_accounts");
    const existingAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    existingAccounts.push(account);
    localStorage.setItem("bank_accounts", JSON.stringify(existingAccounts));

    getAccounts.clear();

    eventBus.emit("accounts:updated", existingAccounts);
  } catch (error) {
    console.error("Помилка збереження рахунку", error);
  }
}

export const getAccounts = memoize(
  function () {
    try {
      const storedAccounts = localStorage.getItem("bank_accounts");
      return storedAccounts ? JSON.parse(storedAccounts) : [];
    } catch (error) {
      console.error("Помилка читання рахунку", error);
      return [];
    }
  },
  { ttl: 60000 },
);

// Видалення користувача
export function removeUser(userId) {
  try {
    const users = getUsers();
    const updated = users.filter((user) => user.id !== userId);
    localStorage.setItem("bank_users", JSON.stringify(updated));

    getUsers.clear();
  } catch (error) {
    console.error("Помилка видалення користувача", error);
  }
}

// Очищення сховища
export function clearStorage() {
  try {
    localStorage.removeItem("bank_users");
    localStorage.removeItem("bank_current_user");
    localStorage.removeItem("bank_transactions");
    localStorage.removeItem("bank_accounts");

    getUsers.clear();
    getCurrentUser.clear();
    getTransactions.clear();
    getAccounts.clear();

    eventBus.emit("user:logout");
  } catch (error) {
    console.error("Помилка очищення сховища", error);
  }
}
