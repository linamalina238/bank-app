export class AuthProxy {
  constructor(client, getToken) {
    this.client = client;
    this.getToken = getToken;
  }

  async request(options) {
    const token = this.getToken();

    return this.client.request({
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
}
