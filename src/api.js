const API_URL = "http://localhost:3000";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function registerUser(name, email, password, phone) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });
  return response.json();
}

export async function getInitData() {
  const response = await fetch(`${API_URL}/init-data`);
  return response.json();
}
