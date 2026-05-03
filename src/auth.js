import { loginAndSave, registerAndSave, getCurrentUser, clearStorage } from './storage.js';
import { eventBus } from './eventBus.js';

export async function handleLogin(email, password) {
  if (!email || !password) {
    return { success: false, message: "Please enter email and password" };
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
  if (!name || !email || !password) {
    return { success: false, message: "Please fill all fields" };
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
  return !!user;
}

export function getCurrentUserFromStorage() {
  return getCurrentUser();
}

export function logout() {
  clearStorage();
  console.log("User logged out");
}

export function onUserLogin(callback) {
  eventBus.on("user:login", callback);
}

export function onUserLogout(callback) {
  eventBus.on("user:logout", callback);
}