import express from "express";
import productRouter from "./routers/api/product.router.api.js"
import cartsRouter from "./routers/api/product.router.api.js"
import displayRoutes from "express-routemap";

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

app.listen(PUERTO, () => {
    displayRoutes(app)
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});