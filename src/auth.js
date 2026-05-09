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
    console.log("User logged in:", result.user.name);
    return { success: true, user: result.user };
  } else {
    console.log("Login error:", result.message);
    return { success: false, message: result.message };
  }
}

export async function handleRegister(name, email, password, phone) {
  const validation = validateRegistrationData(name, email, password, phone);
  if (!validation.success) {
    return validation;
  }

  const result = await registerAndSave(name, email, password, phone);
  
  if (result.success) {
    console.log("New user:", result.user.name);
    return { success: true, user: result.user };
  } else {
    console.log("Registration error:", result.message);
    return { success: false, message: result.message };
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
  console.log("User logged out");
}

export function onUserLogin(callback) {
  eventBus.subscribe("user:login", callback);
}

export function onUserLogout(callback) {
  eventBus.subscribe("user:logout", callback);
}