import { BaseClient } from "./http/baseClient.js";
import { AuthProxy } from "./http/authProxy.js";
import { ApiService } from "./http/apiService.js";

const api = new ApiService(
  new AuthProxy(new BaseClient(), () => localStorage.getItem("token")),
);

const baseClient = new BaseClient();

export function loginUser(email, password) {
  return baseClient.request({
    url: "http://localhost:3000/login",
    method: "POST",
    body: { email, password },
  });
}

export function registerUser(name, email, password, phone) {
  return baseClient.request({
    url: "http://localhost:3000/register",
    method: "POST",
    body: { name, email, password, phone },
  });
}

export function getInitData() {
  return api.getInitData();
}

export function depositRequest(amount) {
  return api.deposit(amount);
}

export function withdrawRequest(amount) {
  return api.withdraw(amount);
}

export function transferRequest(toUserId, amount) {
  return api.transfer(toUserId, amount);
}
