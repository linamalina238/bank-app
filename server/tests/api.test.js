const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");

// Скидаємо data.json перед тестами
const dataPath = path.join(__dirname, "../data.json");
const usersPath = path.join(__dirname, "../users.json");

const resetData = () => {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(
      {
        balance: 0,
        accounts: [],
        transactions: [],
      },
      null,
      2,
    ),
  );
};

const resetUsers = () => {
  fs.writeFileSync(usersPath, JSON.stringify([], null, 2));
};

// Налаштовуємо тестовий сервер
process.env.JWT_SECRET = "test_secret";
require("dotenv").config();

const { authMiddleware } = require("../middleware/auth");
const { log } = require("../../src/logger");
const authRoutes = require("../routes/auth");
const accountRoutes = require("../routes/accounts");
const transactionRoutes = require("../routes/transactions");

const app = express();
app.use(express.json());
app.use(authRoutes);
app.use(accountRoutes);
app.use(transactionRoutes);
app.get("/init-data", authMiddleware, (req, res) => {
  const fresh = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  res.json(fresh);
});

// Хелпери
async function registerUser(name, email, password, phone) {
  return request(app).post("/register").send({ name, email, password, phone });
}

async function loginUser(email, password) {
  return request(app).post("/login").send({ email, password });
}

// ==================== ТЕСТИ ====================

describe("AUTH", () => {
  beforeEach(() => {
    resetUsers();
    resetData();
  });

  test("✅ Реєстрація нового користувача", async () => {
    const res = await registerUser(
      "Катя",
      "katya@test.com",
      "pass123",
      "0991234567",
    );
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("katya@test.com");
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.token).toBeDefined();
  });

  test("❌ Реєстрація з існуючим email", async () => {
    await registerUser("Катя", "katya@test.com", "pass123", "0991234567");
    const res = await registerUser(
      "Катя2",
      "katya@test.com",
      "pass456",
      "0991234568",
    );
    expect(res.body.success).toBe(false);
    expect(res.statusCode).toBe(400);
  });

  test("✅ Логін з правильними даними", async () => {
    await registerUser("Катя", "katya@test.com", "pass123", "0991234567");
    const res = await loginUser("katya@test.com", "pass123");
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
  });

  test("❌ Логін з невірним паролем", async () => {
    await registerUser("Катя", "katya@test.com", "pass123", "0991234567");
    const res = await loginUser("katya@test.com", "wrongpass");
    expect(res.body.success).toBe(false);
    expect(res.statusCode).toBe(401);
  });

  test("❌ Логін з неіснуючим email", async () => {
    const res = await loginUser("nobody@test.com", "pass123");
    expect(res.body.success).toBe(false);
    expect(res.statusCode).toBe(401);
  });
});

describe("INIT-DATA", () => {
  let token;

  beforeEach(async () => {
    resetUsers();
    resetData();
    await registerUser("Катя", "katya@test.com", "pass123", "0991234567");
    const res = await loginUser("katya@test.com", "pass123");
    token = res.body.token;
  });

  test("✅ Отримання даних з токеном", async () => {
    const res = await request(app)
      .get("/init-data")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.accounts).toBeDefined();
    expect(res.body.transactions).toBeDefined();
  });

  test("❌ Отримання даних без токена", async () => {
    const res = await request(app).get("/init-data");
    expect(res.statusCode).toBe(401);
  });
});

describe("DEPOSIT", () => {
  let token;

  beforeEach(async () => {
    resetUsers();
    resetData();
    await registerUser("Катя", "katya@test.com", "pass123", "0991234567");
    const res = await loginUser("katya@test.com", "pass123");
    token = res.body.token;
  });

  test("✅ Поповнення балансу", async () => {
    const res = await request(app)
      .post("/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 500 });
    expect(res.body.success).toBe(true);
    const account = res.body.accounts.find((a) => a.balance === 500);
    expect(account).toBeDefined();
  });

  test("✅ Кілька поповнень підсумовуються", async () => {
    await request(app)
      .post("/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 300 });
    const res = await request(app)
      .post("/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 200 });
    expect(res.body.success).toBe(true);
    const account = res.body.accounts.find((a) => a.balance === 500);
    expect(account).toBeDefined();
  });

  test("❌ Поповнення з від'ємною сумою", async () => {
    const res = await request(app)
      .post("/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: -100 });
    expect(res.body.success).toBe(false);
  });

  test("❌ Поповнення без токена", async () => {
    const res = await request(app).post("/deposit").send({ amount: 500 });
    expect(res.statusCode).toBe(401);
  });
});

describe("WITHDRAW", () => {
  let token;

  beforeEach(async () => {
    resetUsers();
    resetData();
    await registerUser("Катя", "katya@test.com", "pass123", "0991234567");
    const res = await loginUser("katya@test.com", "pass123");
    token = res.body.token;
    // Поповнюємо перед кожним тестом
    await request(app)
      .post("/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 1000 });
  });

  test("✅ Списання з достатнім балансом", async () => {
    const res = await request(app)
      .post("/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 300 });
    expect(res.body.success).toBe(true);
    const account = res.body.accounts.find((a) => a.balance === 700);
    expect(account).toBeDefined();
  });

  test("❌ Списання більше ніж баланс", async () => {
    const res = await request(app)
      .post("/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 9999 });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Недостатньо коштів");
  });

  test("❌ Списання з від'ємною сумою", async () => {
    const res = await request(app)
      .post("/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: -100 });
    expect(res.body.success).toBe(false);
  });
});

describe("TRANSFER", () => {
  let token1;
  let token2;
  let userId2;

  beforeEach(async () => {
    resetUsers();
    resetData();

    await registerUser("Катя", "katya@test.com", "pass123", "0991234567");
    const res1 = await loginUser("katya@test.com", "pass123");
    token1 = res1.body.token;

    const reg2 = await registerUser(
      "Петро",
      "petro@test.com",
      "pass456",
      "0997654321",
    );
    userId2 = reg2.body.user.id;
    const res2 = await loginUser("petro@test.com", "pass456");
    token2 = res2.body.token;

    // Поповнюємо рахунок першого користувача
    await request(app)
      .post("/deposit")
      .set("Authorization", `Bearer ${token1}`)
      .send({ amount: 1000 });

    // Поповнюємо рахунок другого користувача щоб він існував
    await request(app)
      .post("/deposit")
      .set("Authorization", `Bearer ${token2}`)
      .send({ amount: 0.01 });
  });

  test("✅ Успішний переказ", async () => {
    const res = await request(app)
      .post("/transfer")
      .set("Authorization", `Bearer ${token1}`)
      .send({ toUserId: userId2, amount: 200 });
    expect(res.body.success).toBe(true);
  });

  test("❌ Переказ самому собі", async () => {
    const res1 = await loginUser("katya@test.com", "pass123");
    const decoded = JSON.parse(
      Buffer.from(res1.body.token.split(".")[1], "base64").toString(),
    );
    const res = await request(app)
      .post("/transfer")
      .set("Authorization", `Bearer ${token1}`)
      .send({ toUserId: decoded.id, amount: 100 });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Не можна переказати самому собі");
  });

  test("❌ Переказ з недостатнім балансом", async () => {
    const res = await request(app)
      .post("/transfer")
      .set("Authorization", `Bearer ${token1}`)
      .send({ toUserId: userId2, amount: 9999 });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Недостатньо коштів");
  });

  test("❌ Переказ без вказання отримувача", async () => {
    const res = await request(app)
      .post("/transfer")
      .set("Authorization", `Bearer ${token1}`)
      .send({ amount: 100 });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Отримувач не вказаний");
  });
});
