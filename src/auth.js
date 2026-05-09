import { loginAndSave, registerAndSave } from './storage.js';

export async function handleLogin(email, password) {
  if (!email || !password) {
    return { success: false, message: "Please enter email and password" };
  }
  return await loginAndSave(email, password);
}

export async function handleRegister(name, email, password, phone) {
  if (!name || !email || !password) {
    return { success: false, message: "Please fill all fields" };
  }
  return await registerAndSave(name, email, password, phone);
}

export function isAuthenticated() {
  return !!localStorage.getItem("bank_current_user");
}

export function logout() {
  localStorage.removeItem("bank_current_user");
  localStorage.removeItem("bank_transactions");
  localStorage.removeItem("bank_accounts");
  localStorage.removeItem("token");
}

export function getCurrentUser() {
  const user = localStorage.getItem("bank_current_user");
  return user ? JSON.parse(user) : null;
}