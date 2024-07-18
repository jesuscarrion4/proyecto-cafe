import express from 'express';
import { create } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import displayRoutes from "express-routemap";
import productRoutes from './src/routers/api/productRoutes.js';
import cartsRouter from './src/routers/api/cartsRoutes.js';
import viewsRouter from './src/routers/api/views.router.js';
import ProductManager from './src/utils/productManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
});

const productManager = new ProductManager(path.join(__dirname, 'src/data/productos.json'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('io', io);

app.use('/api/products', productRoutes);
app.use('/api/carts', cartsRouter);
app.use("/", viewsRouter);

io.on('connection', async (socket) => {
  console.log('New client connected');

  socket.on('deleteProduct', async (id) => {
    await productManager.destroy(id);
    const products = await productManager.read();
    io.emit('updateProducts', products);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Server is running on port ${PORT}`);
});
