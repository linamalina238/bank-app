const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { log } = require("../../src/logger");

const { accounts, transactions } = require("./accounts");

router.post(
  "/transfer",
  authMiddleware,
  log({ level: "INFO" })(async (req, res) => {
    const { toUserId, amount } = req.body;
    const fromUserId = req.user.id;

    if (!toUserId) {
      return res.json({ success: false, message: "Отримувач не вказаний" });
    }
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.json({ success: false, message: "Невірна сума" });
    }
    if (toUserId === fromUserId) {
      return res.json({ success: false, message: "Не можна переказати самому собі" });
    }

    const fromAccount = accounts.find((a) => a.userId === fromUserId);
    const toAccount = accounts.find((a) => a.userId === toUserId);

    if (!fromAccount) {
      return res.json({ success: false, message: "Ваш рахунок не знайдено" });
    }
    if (!toAccount) {
      return res.json({ success: false, message: "Отримувача не знайдено" });
    }
    if (fromAccount.balance < amount) {
      return res.json({ success: false, message: "Недостатньо коштів" });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    const transaction = {
      id: Date.now(),
      fromId: fromUserId,
      toId: toUserId,
      amount,
      category: "переказ",
      date: new Date().toISOString(),
    };
    transactions.push(transaction);

    res.json({ success: true, accounts: [...accounts], transactions: [...transactions] });
  }),
);

module.exports = router;