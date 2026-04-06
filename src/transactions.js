import { getAccounts, getCurrentUser, saveTransaction, getTransactions } from "./storage.js";

// Переказ
export function transfer(toUserId, amount, category = "переказ") {
  if (!toUserId) {
    console.error("Отримувач не вказаний");
    return false;
  }
  if (!amount && amount !== 0) {
    console.error("Сума не може бути порожньою");
    return false;
  }
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

  if (toUserId === currentUser.id) {
    console.error("Не можна переказати самому собі");
    return false;
  }

  const accounts = getAccounts();
  const myAccount = accounts.find(acc => acc.userId === currentUser.id);
  const toAccount = accounts.find(acc => acc.userId === toUserId);

  if (!myAccount) {
    console.error("Ваш рахунок не знайдено");
    return false;
  }
  if (!toAccount) {
    console.error("Отримувача не знайдено");
    return false;
  }
  if (myAccount.balance < amount) {
    console.error("Недостатньо коштів");
    return false;
  }

  const updated = accounts.map(acc => {
    if (acc.userId === currentUser.id) return { ...acc, balance: acc.balance - amount };
    if (acc.userId === toUserId) return { ...acc, balance: acc.balance + amount };
    return acc;
  });

  localStorage.setItem("bank_accounts", JSON.stringify(updated));

  saveTransaction({
    id: Date.now(),
    fromId: currentUser.id,
    toId: toUserId,
    amount,
    category,
    date: new Date().toISOString()
  });

  return true;
}

// Історія транзакцій
export function getHistory() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const all = getTransactions();
  return all.filter(t => t.fromId === currentUser.id || t.toId === currentUser.id);
}

// Фільтр за категорією
export function getByCategory(category) {
  if (!category) {
    console.error("Категорія не вказана");
    return [];
  }
  return getHistory().filter(t => t.category === category);
}