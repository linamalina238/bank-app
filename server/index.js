require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
let users = require("./users.json");
const data = require("./data.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { log } = require("../src/logger");

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

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

// Генерація JWT токена
function generateToken(req, user) {
  return jwt.sign(
    {
      auth: "bank_app",
      id: user.id,
      email: user.email,
      agent: req.headers["user-agent"],
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
}

function validateToken(token, req) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (
      !decoded ||
      decoded.auth !== "bank_app" ||
      decoded.agent !== req.headers["user-agent"]
    ) {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

//Обробка запиту на реєстрацію нового користувача
app.post(
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

// Middleware для перевірки авторизації
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Необхідно авторизуватися",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Невірний формат токена",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = validateToken(token, req);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Невірний токен",
    });
  }

  req.user = decoded;
  next();
}

//Обробка запиту на отримання даних
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
