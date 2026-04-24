const API_URL = "http://localhost:3000";

export async function loginUser(email, password) {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name, email, password, phone) {
  return apiRequest("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
}

export async function getInitData() {
  return apiRequest("/init-data");
}

export async function depositRequest(amount) {
  return apiRequest("/deposit", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function withdrawRequest(amount) {
  return apiRequest("/withdraw", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function transferRequest(toUserId, amount) {
  return apiRequest("/transfer", {
    method: "POST",
    body: JSON.stringify({ toUserId, amount }),
  });
}

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
}
