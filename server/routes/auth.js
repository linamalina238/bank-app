const express = require("express");
const router = express.Router();
const { generateToken } = require("../middleware/auth");

const users = [];

// Реєстрація
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Введіть логін і пароль" });
  }

  const exists = users.find((u) => u.username === username);
  if (exists) {
    return res.json({ success: false, message: "Користувач вже існує" });
  }

  const user = { id: Date.now().toString(), username, password };
  users.push(user);

  const token = generateToken(req, user);

  res.json({ success: true, token, user: { id: user.id, username } });
});

// Логін
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ success: false, message: "Невірний логін або пароль" });
  }

  const token = generateToken(req, user);

  res.json({ success: true, token, user: { id: user.id, username } });
});

module.exports = router;