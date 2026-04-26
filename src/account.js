import { depositRequest, withdrawRequest } from "./api.js";
import { getAccounts, getCurrentUser, setAccounts, setTransactions } from "./storage.js";

// Баланс
export function getBalance() {
  const accounts = getAccounts();
  const currentUser = getCurrentUser();

  const acc = accounts.find((a) => a.userId === currentUser?.id);
  return acc ? acc.balance : 0;
}

// Поповнення
export async function deposit(amount) {
  const result = await depositRequest(amount);

  if (result.success) {
    setAccounts(result.accounts);
    setTransactions(result.transactions);
  }

  return result;
}

// Списання
export async function withdraw(amount) {
  const result = await withdrawRequest(amount);

  if (result.success) {
    setAccounts(result.accounts);
    setTransactions(result.transactions);
  }

  return result;
}