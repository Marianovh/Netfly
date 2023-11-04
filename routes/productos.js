// routes/productos.js

const express = require("express");
const { getDB } = require("../db");
const { verifyToken } = require("./auth");
const router = express.Router();
const collectionProductos = "PR1_Producto";

router.get("/", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      res.status(403).json({ message: "Acceso no autorizado" });
      return;
    }

    const db = getDB();
    const collection = db.collection(collectionProductos);

    const productos = await collection.find({}).toArray();

    res.status(200).json({ productos });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:ID", verifyToken, async (req, res) => {
  try {
    // Verifica la autenticación
    if (!req.user) {
      res.status(403).json({ message: "Acceso no autorizado" });
      return;
    }

    const db = getDB();
    const collection = db.collection(collectionProductos); // Supongo que has definido collectionName en otro lugar de tu código
    const productoID = parseInt(req.params.ID);

    // Realiza una consulta para obtener el producto por su ID
    const producto = await collection.findOne({ ID: productoID });

    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    // Responde con los detalles del producto
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

router.post("/:ID", verifyToken, async (req, res) => {
  try {
    // Verifica la autenticación
    if (!req.user) {
      res.status(403).json({ message: "Acceso no autorizado" });
      return;
    }

    const db = getDB();
    const collection = db.collection(collectionProductos); // Supongo que has definido collectionName en otro lugar de tu código
    const productoID = parseInt(req.params.ID);
    const datosFromBody = req.body;

    // Verifica si algún campo está vacío
    for (const key in datosFromBody) {
      if (!datosFromBody[key]) {
        res.status(400).json({ message: "No se permiten campos vacíos" });
        return;
      }
    }

    // Crea o actualiza el producto con el ID proporcionado
    const filtro = { ID: productoID };
    const actualizacion = { $set: datosFromBody };
    const opciones = { upsert: true };

    await collection.updateOne(filtro, actualizacion, opciones);

    // Responde con los detalles del producto actualizado o creado
    const productoActualizado = await collection.findOne({
      ID: productoID,
    });
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error("Error al crear o actualizar producto:", error);
    res.status(500).json({ error: "Error al crear o actualizar producto" });
  }
});

router.delete("/:ID", verifyToken, async (req, res) => {
  try {
    // Verifica la autenticación
    if (!req.user) {
      res.status(403).json({ message: "Acceso no autorizado" });
      return;
    }

    const db = getDB();
    const collection = db.collection(collectionProductos); // Supongo que has definido collectionName en otro lugar de tu código
    const productoID = parseInt(req.params.ID);

    // Actualiza el estado del producto para deshabilitarlo en lugar de eliminarlo
    const filtro = { ID: productoID };
    const actualizacion = { $set: { Habilitado: false } };
    const resultado = await collection.updateOne(filtro, actualizacion);

    if (resultado.modifiedCount === 0) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    res.status(200).json({ message: "Producto deshabilitado con éxito" });
  } catch (error) {
    console.error("Error al deshabilitar producto:", error);
    res.status(500).json({ error: "Error al deshabilitar producto" });
  }
});

module.exports = router;
