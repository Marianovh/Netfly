// routes/compra.js

const express = require("express");
const { getDB } = require("../db");
const { verifyToken } = require("./auth");
const router = express.Router();
const collectionName = "PR1_Usuario"; // Collection en MongoDB
const collectionProductos = "PR1_Producto"; // Collection en MongoDB
const collectionbitacoras = "PR1_Bitacora";
router.post("/", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      res.status(403).json({ message: "Acceso no autorizado" });
      return;
    }

    const db = getDB();
    const usuariosCollection = db.collection(collectionName);
    const productosCollection = db.collection(collectionProductos);
    const bitacorasCollection = db.collection(collectionbitacoras);
    const usuario = req.user.CorreoElectronico;

    // ... Código del archivo routes/compra.js (como se proporcionó en respuestas anteriores) ...

    res.status(200).json({ message: "Compra realizada con éxito" });
  } catch (error) {
    console.error("Error al realizar la compra:", error);
    res.status(500).json({ error: "Error al realizar la compra" });
  }
});

module.exports = router;
