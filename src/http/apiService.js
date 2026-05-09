export class ApiService {
  constructor(client) {
    this.client = client;
  }

  getInitData() {
    return this.client.request({ url: "http://localhost:3000/init-data" });
  }

  deposit(amount) {
    return this.client.request({
      url: "http://localhost:3000/deposit",
      method: "POST",
      body: { amount },
    });
  }

  withdraw(amount) {
    return this.client.request({
      url: "http://localhost:3000/withdraw",
      method: "POST",
      body: { amount },
    });
  }

  transfer(toUserId, amount) {
    return this.client.request({
      url: "http://localhost:3000/transfer",
      method: "POST",
      body: { toUserId, amount },
    });
  }
}
