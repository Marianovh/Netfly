// routes/compra.js

const express = require("express");
const { getDB } = require("../db");
const { verifyToken } = require("./auth");
const router = express.Router();
const collectionName = "PR1_Usuario"; // Collection en MongoDB
const collectionProductos = "PR1_Producto"; // Collection en MongoDB
const collectionbitacoras = "PR1_Bitacora";
router.post("/", verifyToken, async (req, res) => {
  const formData = req.body;
  console.log("Datos del formulario recibidos:", formData);

  const collection = db.collection("compras"); // Reemplaza con el nombre de tu colección

  collection.insertOne(formData, (err, result) => {
    if (err) {
      console.error("Error al insertar los datos en la base de datos:", err);
      res
        .status(500)
        .json({ message: "Error al insertar los datos en la base de datos" });
      return;
    }
    console.log("Datos insertados en la base de datos con éxito");
    res.status(200).json({
      message: "Datos del formulario recibidos y guardados en la base de datos",
    });
  });
});

module.exports = router;
