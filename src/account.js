class Account {
  constructor(owner) {
    this.owner = owner;
    this.balance = 0;
  }

  getBalance() {
    return this.balance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Сума має бути більше 0");
    this.balance += amount;
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Сума має бути більше 0");
    if (amount > this.balance) throw new Error("Недостатньо коштів");
    this.balance -= amount;
  }
}

module.exports = Account;