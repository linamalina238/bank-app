require("dotenv").config({ path: "../.env" });
const express = require("express");
const data = require("./data.json");
const { log } = require("../src/logger");
const { authMiddleware } = require("./middleware/auth");
const authRoutes = require("./routes/auth");

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
