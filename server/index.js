const express = require("express");
const fs = require("fs");
const path = require("path");
let users = require("./users.json");
const data = require("./data.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret_key";

const app = express();
app.use(express.json());
const PORT = 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

//Обробка запиту на реєстрацію нового користувача
app.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: "Користувач з такою поштою вже існує",
    });
  }

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  // Додавання нового користувача
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    phone,
  };

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
  });
});

//Обробка запиту на вхід користувача
app.post("/login", async (req, res) => {
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

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  const { password: _, ...safeUser } = user;
  res.json({
    success: true,
    message: "Вхід успішний",
    user: safeUser,
    token,
  });
});

// Middleware для перевірки авторизації
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Необхідно авторизуватися",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Невірний токен",
    });
  }
}

//Обробка запиту на отримання даних
app.get("/init-data", authMiddleware, (req, res) => {
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
