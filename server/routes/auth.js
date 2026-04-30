const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { log } = require("../../src/logger");
const { generateToken } = require("../middleware/auth");

const router = express.Router();

const usersPath = path.join(__dirname, "../users.json");

function readUsers() {
  return JSON.parse(fs.readFileSync(usersPath, "utf-8"));
}

function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

router.post(
  "/register",
  log({ level: "INFO" })(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const users = readUsers();

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: "Користувач з такою поштою вже існує",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone,
    };

    const token = generateToken(req, newUser);

    users.push(newUser);
    writeUsers(users);

    const { password: _, ...safeUser } = newUser;
    res.json({
      success: true,
      message: "Користувач успішно зареєстрований",
      user: safeUser,
      token,
    });
  }),
);

router.post(
  "/login",
  log({ level: "INFO" })(async (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
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