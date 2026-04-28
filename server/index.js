require("dotenv").config();
const express = require("express");
const data = require("./data.json");
const { log } = require("../src/logger");
const { authMiddleware } = require("./middleware/auth");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
<<<<<<< HEAD
app.use(express.static(path.join(__dirname, ".."))); // роздача index.html та src/
const PORT = 3000;
=======
const PORT = process.env.PORT || 3000;
>>>>>>> a81b989869f4da9211c156892aadedf39b4a145e

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

// Роути
app.use(authRoutes);

// Захищений роут
app.get(
  "/init-data",
  authMiddleware,
  log({ level: "INFO" })(async (req, res) => {
    res.json(data);
  }),
);

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
<<<<<<< HEAD

//Обробка запиту на реєстрацію нового користувача
app.post("/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: "Користувач з такою поштою вже існує",
    });
  }

  const newUser = {
    id: String(users.length + 1),
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
=======
>>>>>>> a81b989869f4da9211c156892aadedf39b4a145e
