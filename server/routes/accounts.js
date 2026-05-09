const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { log } = require("../../src/logger");
const fs = require("fs");
const path = require("path");




function readData() {
  const raw = fs.readFileSync(path.join(__dirname, "../data.json"), "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(
    path.join(__dirname, "../data.json"),
    JSON.stringify(data, null, 2),
  );
}


router.post(
  "/deposit",
  authMiddleware,
  log({ level: "INFO" })(async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.json({ success: false, message: "Невірна сума" });
    }
 const data = readData();

    let account = data.accounts.find((a) => a.userId === userId);
    if (!account) {
      account = { userId, balance: 0 };
      data.accounts.push(account);
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
    data.transactions.push(transaction);

    writeData(data);

    res.json({ success: true, accounts: [...data.accounts], transactions: [...data.transactions] });
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

    const data = readData();
    const account = data.accounts.find((a) => a.userId === userId);
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
    data.transactions.push(transaction);

    writeData(data);

    res.json({ success: true, accounts: [...data.accounts], transactions: [...data.transactions] });
  }),
);

module.exports = { router };