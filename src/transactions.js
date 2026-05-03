import { transferRequest } from "./api.js";
import { setAccounts, setTransactions, getTransactions, getCurrentUser } from "./storage.js";

// Переказ
export async function transfer(toUserId, amount) {
  const result = await transferRequest(toUserId, amount);

  if (result.success) {
    setAccounts(result.accounts);
    setTransactions(result.transactions);
  }

  return result;
}


export function getHistory() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const all = getTransactions();
  return all.filter(
    (t) => t.fromId === currentUser.id || t.toId === currentUser.id
  );
}


export function getByCategory(category) {
  if (!category) return [];
  return getHistory().filter((t) => t.category === category);
}