import { loginUser, registerUser } from './api.js';

export async function handleLogin(email, password) {
  if (!email || !password) {
    return { success: false, message: "Please enter email and password" };
  }

  const result = await loginUser(email, password);
  
  if (result.success) {
    localStorage.setItem("bank_user", JSON.stringify(result.user));
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

  const result = await registerUser(name, email, password, phone);
  
  if (result.success) {
    localStorage.setItem("bank_user", JSON.stringify(result.user));
    console.log("New user:", result.user.name);
    return { success: true, user: result.user };
  } else {
    console.log("Registration error:", result.message);
    return { success: false, message: result.message };
  }
}

export function isAuthenticated() {
  const user = localStorage.getItem("bank_user");
  if (user) {
    return true;
  } else {
    return false;
  }
}

export function logout() {
  localStorage.removeItem("bank_user");
  console.log("User logged out");
}

export function getCurrentUser() {
  const user = localStorage.getItem("bank_user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
}