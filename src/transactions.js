class Transactions {
  constructor() {
    this.history = [];
  }

  addTransaction(type, amount, category = "інше") {
    this.history.push({
      type,
      amount,
      category,
      date: new Date().toISOString()
    });
  }

  transfer(fromAccount, toAccount, amount) {
    fromAccount.withdraw(amount);
    toAccount.deposit(amount);
    this.addTransaction("transfer", amount, "переказ");
  }

  getHistory() {
    return this.history;
  }

  getByCategory(category) {
    return this.history.filter(t => t.category === category);
  }
}

module.exports = Transactions;