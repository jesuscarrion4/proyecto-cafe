import { Router } from 'express';
import CartManager from '../cartManager.js';

const cartsRouter = Router();
const cartManager = new CartManager('./carts.json');

// Inicializar el CartManager
(async () => {
    await cartManager.init();
})();

/**
 * Crea un nuevo carrito.
 */
cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({ success: true, response: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, response: "Error interno del servidor" });
  }
});

/**
 * Obtiene un carrito por su ID.
 */
cartsRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = cartManager.getCartById(cid);
  if (!cart) {
    res.status(404).json({ success: false, response: "Cart not found" });
  } else {
    res.status(200).json({ success: true, response: cart });
  }
});

/**
 * Agrega un producto a un carrito.
 */
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json({ success: true, response: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, response: "Error interno del servidor" });
  }
});

/**
 * Elimina un producto de un carrito.
 */
cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.deleteProductFromCart(cid, pid);
    res.status(200).json({ success: true, response: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, response: "Error interno del servidor" });
  }
});

/**
 * Elimina un carrito por su ID.
 */
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.deleteCart(cid);
    res.status(200).json({ success: true, response: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, response: "Error interno del servidor" });
  }
});

export default cartsRouter;
