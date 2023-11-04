// routes/registro.js

const express = require("express");
const { getDB } = require("../db");
const { verifyToken } = require("./auth");
const router = express.Router();
const collectionName = "PR1_Usuario";

router.post("/:dpi", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection(collectionName);
    const datosFromBody = req.body;
    const dpiFromURL = req.params.dpi.toString();

    const datosAInsertar = {
      id: dpiFromURL,
      ...datosFromBody,
    };

    await collection.insertOne(datosAInsertar);

    res.status(201).json({
      message: "Documento insertado con éxito",
    });
  } catch (error) {
    console.error("Error al insertar documento:", error);
    res.status(500).json({ error: "Error al insertar documento" });
  }
});

module.exports = router;
