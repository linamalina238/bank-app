const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

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

module.exports = { generateToken, validateToken, authMiddleware };
