const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { log } = require("../../src/logger");
const { generateToken } = require("../middleware/auth");

const router = express.Router();
const users = require("../users.json");

//Обробка запиту на реєстрацію нового користувача
router.post(
  "/register",
  log({ level: "INFO" })(async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: "Користувач з такою поштою вже існує",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Додавання нового користувача
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone,
    };

    const token = generateToken(req, newUser);

    users.push(newUser);
    fs.writeFileSync(
      path.join(__dirname, "users.json"),
      JSON.stringify(users, null, 2),
    );

    const { password: _, ...safeUser } = newUser;
    res.json({
      success: true,
      message: "Користувач успішно зареєстрований",
      user: safeUser,
      token,
    });
  }),
);

//Обробка запиту на вхід користувача
app.post(
  "/login",
  log({ level: "INFO" })(async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Невірна пошта або пароль",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Невірна пошта або пароль",
      });
    }

    const token = generateToken(req, user);

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      message: "Вхід успішний",
      user: safeUser,
      token,
    });
  }),
);

module.exports = router;
