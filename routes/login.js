// routes/login.js

const express = require("express");
const { getDB } = require("../db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./auth");
const router = express.Router();
const collectionName = "PR1_Usuario";
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection(collectionName);
    const { email, password } = req.body;

    const usuarioEncontrado = await collection.findOne({
      email,
      password,
    });

    if (!usuarioEncontrado) {
      res.status(401).json({ message: "Credenciales incorrectas" });
      return;
    }

    const token = jwt.sign({ email }, "secretKey", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

module.exports = router;
