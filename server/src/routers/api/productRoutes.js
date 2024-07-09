import { Router } from 'express';
import bodyParser from 'body-parser';
import ProductManager from '../../utils/productManager.js';

const productRouter = Router();
productRouter.use(bodyParser.json());

const filePath = '../server/src/data/products.json';
let productManager;

async function initializeProductManager() {
  try {
    productManager = new ProductManager(filePath);
    await productManager.initialize();
  } catch (error) {
    console.error('Error al inicializar ProductManager:', error.message);
    throw error; // Propagar el error para que se maneje en otro lugar
  }
}

// Middleware para asegurar que productManager esté inicializado antes de manejar las rutas
productRouter.use(async (req, res, next) => {
  if (!productManager) {
    try {
      await initializeProductManager();
    } catch (error) {
      return res.status(500).json({ error: 'Error al inicializar ProductManager.' });
    }
  }
  next();
});

// Endpoint para obtener todos los productos
productRouter.get('/', async (req, res) => {
  try {
    const products = await productManager.read();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

// Endpoint para obtener un producto por ID
productRouter.get('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productManager.readOne(productId);
    if (!product) {
      return res.status(404).json({ error: `Producto con ID ${productId} no encontrado.` });
    }
    res.json(product);
  } catch (error) {
    console.error(`Error al obtener producto con ID ${productId}:`, error.message);
    res.status(500).json({ error: `Error al obtener producto con ID ${productId}.` });
  }
});

// Endpoint para crear un nuevo producto
productRouter.post('/', async (req, res) => {
  const productData = req.body;

  if (!productData) {
    return res.status(400).json({ error: 'Datos del producto no proporcionados' });
  }

  try {
    await productManager.create(productData);
    res.json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el producto:', error.message);
    res.status(500).json({ error: 'Error al crear el producto.' });
  }
});

// Endpoint para actualizar un producto por ID
productRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedData = req.body;

  if (!updatedData) {
    return res.status(400).json({ error: 'Datos de actualización no proporcionados' });
  }

  try {
    await productManager.update(productId, updatedData);
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error(`Error al actualizar el producto con ID ${productId}:`, error.message);
    res.status(500).json({ error: `Error al actualizar el producto con ID ${productId}.` });
  }
});

// Endpoint para eliminar un producto por ID
productRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    await productManager.destroy(productId);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${productId}:`, error.message);
    res.status(500).json({ error: `Error al eliminar el producto con ID ${productId}.` });
  }
});

export default productRouter;
