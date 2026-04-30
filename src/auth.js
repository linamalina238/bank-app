import { loginAndSave, registerAndSave, getCurrentUser, clearStorage } from './storage.js';
import { validateLoginData, validateRegistrationData } from './validation.js';
import { eventBus } from './eventBus.js';

export async function handleLogin(email, password) {
  const validation = validateLoginData(email, password);
  if (!validation.success) {
    return validation;
  }

  const result = await loginAndSave(email, password);
  
  if (result.success) {
    console.log("Користувач увійшов:", result.user.name);
    return { success: true, user: result.user };
  } else {
    return { success: false, message: result.message || "Помилка входу" };
  }
}

export async function handleRegister(name, email, password, phone) {
  const validation = validateRegistrationData(name, email, password, phone);
  if (!validation.success) {
    return validation;
  }

  const result = await registerAndSave(name, email, password, phone);
  
  if (result.success) {
    console.log("Новий користувач створений:", result.user.name);
    return { success: true, user: result.user };
  } else {
    return { success: false, message: result.message || "Помилка реєстрації" };
  }
}

export function isAuthenticated() {
  const user = getCurrentUser();
  const token = localStorage.getItem("token");
  return !!(user && token);
}

export function getCurrentUserFromStorage() {
  return getCurrentUser();
}

export function logout() {
  clearStorage();
  console.log("Користувач вийшов з системи");
}

export function onUserLogin(callback) {
  eventBus.subscribe("user:login", callback);
}

export function onUserLogout(callback) {
  eventBus.subscribe("user:logout", callback);
}