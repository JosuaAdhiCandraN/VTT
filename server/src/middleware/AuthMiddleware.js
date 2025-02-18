// middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "123adyode";

// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Mendapatkan token dari header Authorization

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Menyimpan data user dari token ke req.user
    next(); // Melanjutkan ke middleware atau rute berikutnya
  } catch (error) {
    res.status(403).send({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticateToken };
