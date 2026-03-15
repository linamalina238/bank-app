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
