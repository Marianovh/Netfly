// routes/carrito.js

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
    const usuario = req.user.email;

    const carrito = await collection.findOne({ email: usuario });

    if (!carrito || !carrito.Productos || carrito.Productos.length === 0) {
      res.status(404).json({ message: "Carrito de compras vacío" });
      return;
    }

    res.status(200).json(carrito);
  } catch (error) {
    console.error("Error al obtener carrito de compras:", error);
    res.status(500).json({ error: "Error al obtener carrito de compras" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    // Verifica la autenticación
    if (!req.user) {
      res.status(403).json({ message: "Acceso no autorizado" });
      return;
    }

    const db = getDB();
    const collection = db.collection(collectionProductos); // Supongo que has definido collectionProductos en otro lugar de tu código
    const usuario = req.user.email;
    const datosFromBody = req.body;

    // Verifica si algún campo está vacío
    if (!datosFromBody.Identificador || !datosFromBody.Cantidad) {
      res
        .status(400)
        .json({ message: "Identificador y Cantidad son campos requeridos" });
      return;
    }

    // Obtiene el producto a agregar al carrito
    const producto = await collection.findOne({
      Identificador: datosFromBody.Identificador,
    });

    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    // Verifica la disponibilidad del producto
    if (producto.Disponibilidad < parseInt(datosFromBody.Cantidad)) {
      res
        .status(400)
        .json({ message: "Cantidad solicitada supera la disponibilidad" });
      return;
    }

    // Obtiene el carrito de compras actual del usuario
    const carrito = await collection.findOne({ email: usuario });

    if (!carrito) {
      // Si el usuario no tiene un carrito de compras, crea uno nuevo
      const nuevoCarrito = {
        email: usuario,
        Productos: [
          { ...producto, Cantidad: parseInt(datosFromBody.Cantidad) },
        ],
        Total: producto.PrecioDescuento * datosFromBody.Cantidad,
      };
      console.log(
        "producto",
        producto.PrecioDescuento,
        "cantidad",
        datosFromBody.Cantidad
      );
      await collection.insertOne(nuevoCarrito);
    } else {
      // Si el usuario ya tiene un carrito de compras, actualiza el carrito
      const productoExistente = carrito.Productos.find(
        (p) => p.Identificador === producto.Identificador
      );
      if (productoExistente) {
        // Si el producto ya está en el carrito, actualiza la cantidad y el total
        productoExistente.Cantidad += parseInt(datosFromBody.Cantidad);
        carrito.Total +=
          producto.PrecioDescuento * parseFloat(datosFromBody.Cantidad);
      } else {
        // Si el producto no está en el carrito, agrégalo
        carrito.Productos.push({
          ...producto,
          Cantidad: parseInt(datosFromBody.Cantidad),
        });
        carrito.Total +=
          producto.PrecioDescuento * parseInt(datosFromBody.Cantidad);
      }
      await collection.updateOne({ email: usuario }, { $set: carrito });
    }

    // Actualiza la disponibilidad del producto en la base de datos general
    const nuevaDisponibilidad =
      producto.Disponibilidad - parseInt(datosFromBody.Cantidad);
    await collection.updateOne(
      { Identificador: datosFromBody.Identificador },
      { $set: { Disponibilidad: nuevaDisponibilidad } }
    );

    // Responde con los detalles del carrito de compras actualizado
    const carritoActualizado = await collection.findOne({
      email: usuario,
    });
    res.status(200).json(carritoActualizado);
  } catch (error) {
    console.error("Error al actualizar carrito de compras:", error);
    res.status(500).json({ error: "Error al actualizar carrito de compras" });
  }
});

router.delete("/", verifyToken, async (req, res) => {
  try {
    // Verifica la autenticación
    if (!req.user) {
      res.status(403).json({ message: "Acceso no autorizado" });
      return;
    }

    const db = getDB();
    const collection = db.collection(collectionProductos); // Supongo que has definido collectionProductos en otro lugar de tu código
    const usuario = req.user.email;

    // Obtiene el carrito de compras actual del usuario
    const carrito = await collection.findOne({ email: usuario });

    if (!carrito || !carrito.Productos || carrito.Productos.length === 0) {
      res.status(404).json({ message: "Carrito de compras vacío" });
      return;
    }

    // Actualiza la disponibilidad de los productos en la base de datos general
    for (const productoCarrito of carrito.Productos) {
      const producto = await collection.findOne({
        Identificador: productoCarrito.Identificador,
      });
      if (producto) {
        const nuevaDisponibilidad =
          producto.Disponibilidad + productoCarrito.Cantidad;
        await collection.updateOne(
          { Identificador: productoCarrito.Identificador },
          { $set: { Disponibilidad: nuevaDisponibilidad } }
        );
      }
    }

    // Elimina el carrito de compras del usuario
    await collection.deleteOne({ email: usuario });

    res.status(200).json({ message: "Carrito de compras eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar carrito de compras:", error);
    res.status(500).json({ error: "Error al eliminar carrito de compras" });
  }
});

module.exports = router;
