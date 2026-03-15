// Користувачі
export function saveUser(user) {
  try {
    const storedUsers = localStorage.getItem("bank_users");
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];

    existingUsers.push(user);
    localStorage.setItem("bank_users", JSON.stringify(existingUsers));
  } catch (error) {
    console.error("Помилка збереження користувача:", error);
  }
}

export function saveCurrentUser(user) {
  try {
    localStorage.setItem("bank_current_user", JSON.stringify(user));
  } catch (error) {
    console.error("Помилка збереження поточного користувача:", error);
  }
}

export function getUsers() {
  try {
    const storedUsers = localStorage.getItem("bank_users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error("Помилка читання користувачів:", error);
    return [];
  }
}

export function getCurrentUser() {
  try {
    const storedUsers = localStorage.getItem("bank_current_user");
    return storedUsers ? JSON.parse(storedUsers) : null;
  } catch (error) {
    console.error("Помилка читання користувачів:", error);
    return null;
  }
}

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
  } catch (error) {
    console.error("Помилка збереження транзакції", error);
  }
}

export function getTransactions() {
  try {
    const storedTransactions = localStorage.getItem("bank_transactions");
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  } catch (error) {
    console.error("Помилка читання транзакції", error);
    return [];
  }
}

// Рахунки
export function saveAccounts(account) {
  try {
    const storedAccounts = localStorage.getItem("bank_accounts");
    const existingAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    existingAccounts.push(account);
    localStorage.setItem("bank_accounts", JSON.stringify(existingAccounts));
  } catch (error) {
    console.error("Помилка збереження рахунку", error);
  }
}

export function getAccounts() {
  try {
    const storedAccounts = localStorage.getItem("bank_accounts");
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  } catch (error) {
    console.error("Помилка читання рахунку", error);
    return [];
  }
}
