import { memoize } from "./memoize.js";
import { loginUser, registerUser, getInitData } from "./api.js";
import { eventBus } from "./eventBus.js";

async function successAuth(user, token) {
  saveCurrentUser(user);

  if (token) {
    localStorage.setItem("token", token);
  }

  try {
    const data = await getInitData();
    if (!data || !data.transactions) return;

    localStorage.setItem(
      "bank_accounts",
      JSON.stringify([{ userId: user.id, balance: data.balance }]),
    );

    localStorage.setItem(
      "bank_transactions",
      JSON.stringify(data.transactions),
    );

    eventBus.emit("init:data", data);
    eventBus.emit("user:login", user);

    getAccounts.clear();
    getTransactions.clear();
  } catch (error) {
    console.error("Помилка отримання початкових даних", error);
  }
}

export async function loginAndSave(email, password) {
  const result = await loginUser(email, password);

  if (result.success) {
    await successAuth(result.user, result.token);
  }
  return result;
}

export async function registerAndSave(name, email, password, phone) {
  const result = await registerUser(name, email, password, phone);

  if (result.success) {
    await successAuth(result.user, result.token);
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

export const getCurrentUser = memoize(
  function () {
    try {
      const storedUser = localStorage.getItem("bank_current_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Помилка читання поточного користувача", error);
      return null;
    }
  },
  { ttl: 60000 },
);

// Транзакції
export function saveTransaction(newTransaction) {
  try {
    const storedTransactions = localStorage.getItem("bank_transactions");
    const existingTransactions = storedTransactions
      ? JSON.parse(storedTransactions)
      : [];
    existingTransactions.push(newTransaction);
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
export function saveAccounts(updatedAccount) {
  try {
    const storedAccounts = localStorage.getItem("bank_accounts");
    const existingAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    const updatedAccounts = existingAccounts.filter(
      (acc) => acc.userId !== updatedAccount.userId,
    );
    updatedAccounts.push(updatedAccount);

    localStorage.setItem("bank_accounts", JSON.stringify(updatedAccounts));

    getAccounts.clear();

    eventBus.emit("accounts:updated", updatedAccounts);
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

// Очищення сховища
export function clearStorage() {
  try {
    localStorage.removeItem("bank_users");
    localStorage.removeItem("bank_current_user");
    localStorage.removeItem("bank_transactions");
    localStorage.removeItem("bank_accounts");
    localStorage.removeItem("token");

    getCurrentUser.clear();
    getTransactions.clear();
    getAccounts.clear();

    eventBus.emit("user:logout");
  } catch (error) {
    console.error("Помилка очищення сховища", error);
  }
}
