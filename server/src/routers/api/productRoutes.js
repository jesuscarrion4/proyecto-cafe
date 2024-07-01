import { Router } from 'express';
import bodyParser from 'body-parser';
import productManager from "../productManager.js";


const productRouter = Router();

productRouter.use(bodyParser.json());
await productManager.initialize();

// Endpoint para obtener todos los productos
productRouter.get('/', async (req, res) => {
  const allProducts = await productManager.read();
  res.json(allProducts);
});

// Endpoint para obtener un producto por ID
productRouter.get('/:id', async (req, res) => {
  const productId = req.params.id;
  const product = await productManager.readOne(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productRouter.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.read();
  res.render('realTimeProducts', { products });
});


// Endpoint para crear un nuevo producto
productRouter.post('/', async (req, res) => {
  const productData = req.body;

  if (!productData) {
    res.status(400).json({ error: 'Datos del producto no proporcionados' });
    return;
  }

  try {
    await productManager.create(productData);
    res.json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Endpoint para actualizar un producto por ID
productRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedData = req.body;

  if (!updatedData) {
    res.status(400).json({ error: 'Datos de actualización no proporcionados' });
    return;
  }

  try {
    await productManager.update(productId, updatedData);
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto por ID' });
  }
});

// Endpoint para eliminar un producto por ID
productRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    await productManager.destroy(productId);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto por ID' });
  }
});

export default productRouter;