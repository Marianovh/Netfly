const express = require("express");
const jwt = require("jsonwebtoken");
const { connect, getDB } = require("./db");
const app = express();
const registroRouter = require("./routes/registro");
const loginRouter = require("./routes/login");
const perfilRouter = require("./routes/perfil");
const productosRouter = require("./routes/productos");
const carritoRouter = require("./routes/carrito");
const compraRouter = require("./routes/compra");
const { verifyToken } = require("./routes/auth");
const express = require("express");
const cors = require("cors"); // Importa el paquete 'cors'

connect();
// Configura el middleware de CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Reemplaza con tu dominio
  })
);

app.use(express.json());

// Usa las rutas
app.use("/api/registro", registroRouter);
app.use("/api/login", loginRouter);
app.use("/api/perfil", perfilRouter);
app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);
app.use("/api/compra", compraRouter);

// Configuración del puerto y la escucha del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El servidor se está ejecutando en el puerto ${PORT}`);
});
