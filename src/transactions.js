import { getAccounts, getCurrentUser, saveTransaction, getTransactions } from "./storage.js";

// Переказ іншому користувачу
export function transfer(toUserId, amount, category = "переказ") {
  if (amount <= 0) {
    console.error("Сума має бути більше 0");
    return false;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const accounts = getAccounts();
  const myAccount = accounts.find(acc => acc.userId === currentUser.id);
  const toAccount = accounts.find(acc => acc.userId === toUserId);

  if (!toAccount) {
    console.error("Отримувача не знайдено");
    return false;
  }
  if (myAccount.balance < amount) {
    console.error("Недостатньо коштів");
    return false;
  }

  // Оновлюємо баланси обох
  const updated = accounts.map(acc => {
    if (acc.userId === currentUser.id) return { ...acc, balance: acc.balance - amount };
    if (acc.userId === toUserId) return { ...acc, balance: acc.balance + amount };
    return acc;
  });
  localStorage.setItem("bank_accounts", JSON.stringify(updated));

  // Зберігаємо в історію
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

// Історія транзакцій поточного користувача
export function getHistory() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const all = getTransactions();
  return all.filter(t => t.fromId === currentUser.id || t.toId === currentUser.id);
}

// Фільтр за категорією
export function getByCategory(category) {
  return getHistory().filter(t => t.category === category);
}