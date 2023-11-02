// routes/auth.js

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).json({ message: "Token no generado" });
  }

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token generado inválido" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  verifyToken,
};
