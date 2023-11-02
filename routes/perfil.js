// routes/perfil.js

const express = require("express");
const { getDB } = require("../db");
const { verifyToken } = require("./auth"); // Asegúrate de usar la ruta correcta hacia auth.js
const router = express.Router();
const collectionName = "PR1_Usuario";

router.get("/:DPI", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection(collectionName);
    const DPI = parseInt(req.params.DPI);

    const usuarioEncontrado = await collection.findOne({ id: DPI });

    if (!usuarioEncontrado) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(usuarioEncontrado);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

router.post("/:DPI", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection(collectionName);
    const DPI = parseInt(req.params.DPI);
    const datosFromBody = req.body;

    for (const key in datosFromBody) {
      if (!datosFromBody[key]) {
        res.status(400).json({ message: "No se permiten campos vacíos" });
        return;
      }
    }

    const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!correoRegex.test(datosFromBody.email)) {
      res.status(400).json({ message: "Formato de email inválido" });
      return;
    }

    const filtro = { id: DPI };
    const actualizacion = {
      $set: {
        nombre: datosFromBody.nombre,
        apellido: datosFromBody.apellido,
        fechanacimiento: datosFromBody.fechanacimiento,
        direccion: datosFromBody.direccion,
        nit: datosFromBody.nit,
        numeroTelefono: datosFromBody.numeroTelefono,
        email: datosFromBody.email,
      },
    };

    const resultado = await collection.updateOne(filtro, actualizacion);

    if (resultado.modifiedCount === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ message: "Perfil actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

router.delete("/:DPI", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection(collectionName);
    const DPI = parseInt(req.params.DPI);

    const resultado = await collection.deleteOne({ id: DPI });

    if (resultado.deletedCount === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    res.status(500).json({ error: "Error al eliminar perfil" });
  }
});

module.exports = router;
