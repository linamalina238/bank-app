const express = require("express");
const fs = require("fs");
const path = require("path");
const users = require("./users.json");
const data = require("./data.json");

const app = express();
app.use(express.json());
const PORT = 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

//Обробка запиту на реєстрацію нового користувача
app.post("/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: "Користувач з такою поштою вже існує",
    });
  }

  // Додавання нового користувача
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    phone,
  };

  users.push(newUser);

  fs.writeFileSync(
    path.join(__dirname, "users.json"),
    JSON.stringify(users, null, 2),
  );

  res.json({
    success: true,
    message: "Користувач успішно зареєстрований",
    user: newUser,
  });
});

//Обробка запиту на вхід користувача
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    res.json({
      success: true,
      message: "Успішний вхід",
      user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Невірна пошта або пароль",
    });
  }
});

//Обробка запиту на отримання даних
app.get("/init-data", (req, res) => {
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
