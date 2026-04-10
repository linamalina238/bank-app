// auth.js
import { loginUser, registerUser } from './api.js';

export async function handleLogin(email, password) {
  const result = await loginUser(email, password);
  
  if (result.success) {
    localStorage.setItem("bank_user", JSON.stringify(result.user));
    return { success: true, user: result.user };
  } else {
    return { success: false, message: result.message };
  }
}

export async function handleRegister(name, email, password, phone) {
  const result = await registerUser(name, email, password, phone);
  
  if (result.success) {
    localStorage.setItem("bank_user", JSON.stringify(result.user));
    return { success: true, user: result.user };
  } else {
    return { success: false, message: result.message };
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("bank_user");
}

export function getCurrentUser() {
  const user = localStorage.getItem("bank_user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("bank_user");
}