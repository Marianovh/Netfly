// routes/registro.js

const express = require("express");
const { getDB } = require("../db");
const { verifyToken } = require("./auth");
const router = express.Router();
const collectionName = "PR1_Usuario";
const app = express();
const cors = require("cors"); // Importa el paquete 'cors'
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://netlify--coruscating-queijadas-1247a0.netlify.app/api/registro"
  ); // Es lo mismo que la configuracion de CORS de abajo
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-access-token");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
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
