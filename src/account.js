import { getAccounts, getCurrentUser, saveAccounts } from "./storage.js";

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
  if (amount <= 0) {
    console.error("Сума має бути більше 0");
    return false;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const accounts = getAccounts();
  const updated = accounts.map(acc => {
    if (acc.userId === currentUser.id) {
      return { ...acc, balance: acc.balance + amount };
    }
    return acc;
  });

  localStorage.setItem("bank_accounts", JSON.stringify(updated));
  return true;
}

// Списання
export function withdraw(amount) {
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

  const updated = accounts.map(acc => {
    if (acc.userId === currentUser.id) {
      return { ...acc, balance: acc.balance - amount };
    }
    return acc;
  });

  localStorage.setItem("bank_accounts", JSON.stringify(updated));
  return true;
}

// Створити рахунок для нового користувача
export function createAccount(userId) {
  const accounts = getAccounts();

  const already = accounts.find(acc => acc.userId === userId);
  if (already) {
    console.error("Рахунок вже існує");
    return false;
  }

  const newAccount = {
    id: Date.now(),
    userId: userId,
    balance: 0
  };

  accounts.push(newAccount);
  localStorage.setItem("bank_accounts", JSON.stringify(accounts));
  return newAccount;
}

// Отримати інфо про рахунок поточного користувача
export function getAccount() {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const accounts = getAccounts();
  return accounts.find(acc => acc.userId === currentUser.id) || null;
}

// Перевірити чи є рахунок у користувача
export function hasAccount(userId) {
  const accounts = getAccounts();
  return accounts.some(acc => acc.userId === userId);
}

// Скинути баланс до 0
export function resetBalance() {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const accounts = getAccounts();
  const updated = accounts.map(acc => {
    if (acc.userId === currentUser.id) {
      return { ...acc, balance: 0 };
    }
    return acc;
  });

  localStorage.setItem("bank_accounts", JSON.stringify(updated));
  return true;
}