const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { log } = require("../../src/logger");


const accounts = [];
const transactions = [];

router.post(
  "/deposit",
  authMiddleware,
  log({ level: "INFO" })(async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.json({ success: false, message: "Невірна сума" });
    }

    let account = accounts.find((a) => a.userId === userId);
    if (!account) {
      account = { userId, balance: 0 };
      accounts.push(account);
    }

    account.balance += amount;

    const transaction = {
      id: Date.now(),
      fromId: null,
      toId: userId,
      amount,
      category: "поповнення",
      date: new Date().toISOString(),
    };
    transactions.push(transaction);

    res.json({ success: true, accounts: [...accounts], transactions: [...transactions] });
  }),
);

router.post(
  "/withdraw",
  authMiddleware,
  log({ level: "INFO" })(async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.json({ success: false, message: "Невірна сума" });
    }

    const account = accounts.find((a) => a.userId === userId);
    if (!account) {
      return res.json({ success: false, message: "Рахунок не знайдено" });
    }
    if (account.balance < amount) {
      return res.json({ success: false, message: "Недостатньо коштів" });
    }

    account.balance -= amount;

    const transaction = {
      id: Date.now(),
      fromId: userId,
      toId: null,
      amount,
      category: "списання",
      date: new Date().toISOString(),
    };
    transactions.push(transaction);

    res.json({ success: true, accounts: [...accounts], transactions: [...transactions] });
  }),
);

module.exports = router;