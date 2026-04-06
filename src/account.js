import { getAccounts, getCurrentUser } from "./storage.js";

// Баланс
export function getBalance() {
  const currentUser = getCurrentUser();
  if (!currentUser) return 0;

  const accounts = getAccounts();
  const myAccount = accounts.find(acc => acc.userId === currentUser.id);
  return myAccount ? myAccount.balance : 0;
}

// Поповнення
export function deposit(amount) {
  if (typeof amount !== "number") {
    console.error("Сума має бути числом");
    return false;
  }
  if (amount <= 0) {
    console.error("Сума має бути більше 0");
    return false;
  }
  if (amount > 1000000) {
    console.error("Сума не може перевищувати 1,000,000");
    return false;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const accounts = getAccounts();
  const updated = accounts.map(acc =>
    acc.userId === currentUser.id
      ? { ...acc, balance: acc.balance + amount }
      : acc
  );

  localStorage.setItem("bank_accounts", JSON.stringify(updated));
  return true;
}

// Списання
export function withdraw(amount) {
  if (typeof amount !== "number") {
    console.error("Сума має бути числом");
    return false;
  }
  if (amount <= 0) {
    console.error("Сума має бути більше 0");
    return false;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const accounts = getAccounts();
  const myAccount = accounts.find(acc => acc.userId === currentUser.id);

  if (!myAccount) return false;
  if (myAccount.balance < amount) {
    console.error("Недостатньо коштів");
    return false;
  }

  const updated = accounts.map(acc =>
    acc.userId === currentUser.id
      ? { ...acc, balance: acc.balance - amount }
      : acc
  );

  localStorage.setItem("bank_accounts", JSON.stringify(updated));
  return true;
}

// Створити рахунок
export function createAccount(userId) {
  if (!userId) {
    console.error("userId не може бути порожнім");
    return false;
  }

  const accounts = getAccounts();
  if (accounts.find(acc => acc.userId === userId)) {
    console.error("Рахунок вже існує");
    return false;
  }

  const newAccount = {
    id: Date.now(),
    userId: userId,
    balance: 0
  };

  localStorage.setItem("bank_accounts", JSON.stringify([...accounts, newAccount]));
  return newAccount;
}

// Отримати рахунок поточного користувача
export function getAccount() {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const accounts = getAccounts();
  return accounts.find(acc => acc.userId === currentUser.id) || null;
}

// Перевірити чи є рахунок
export function hasAccount(userId) {
  if (!userId) return false;
  const accounts = getAccounts();
  return accounts.some(acc => acc.userId === userId);
}

// Скинути баланс до 0
export function resetBalance() {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const accounts = getAccounts();
  const updated = accounts.map(acc =>
    acc.userId === currentUser.id
      ? { ...acc, balance: 0 }
      : acc
  );

  localStorage.setItem("bank_accounts", JSON.stringify(updated));
  return true;
}