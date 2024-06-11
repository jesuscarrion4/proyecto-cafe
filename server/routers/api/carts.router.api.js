import { Router } from 'express';
import CartManager from '../../src/cartManager.js';

const cartsRouter = Router();

/**
 * Crea un nuevo carrito.
 */
cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await CartManager.createCart();
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
  const cart = CartManager.getCartById(cid);
  if (typeof cart !== "object") {
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
    const quantity = parseInt(req.query.quantity) || 1;
    const cart = await CartManager.addProductsToCart(cid, { pid, quantity });
    if (typeof cart !== "object") {
      res.status(500).json({ success: false, response: "Failed to add product to cart" });
    } else {
      res.status(200).json({ success: true, response: cart });
    }
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
    const quantity = parseInt(req.query.quantity) || 0;
    const cart = await CartManager.deleteProductFromCart(cid, { pid, quantity });
    if (typeof cart !== "object") {
      res.status(500).json({ success: false, response: "Failed to delete product from cart" });
    } else {
      res.status(200).json({ success: true, response: cart });
    }
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
    const cart = await CartManager.deleteCart(cid);
    if (cart !== "Cart deleted") {
      res.status(500).json({ success: false, response: "Failed to delete cart" });
    } else {
      res.status(200).json({ success: true, response: cart });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, response: "Error interno del servidor" });
  }
});

export default cartsRouter;