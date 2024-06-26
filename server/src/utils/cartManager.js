import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.idCounter = 0;
    }

    async init() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                this.carts = JSON.parse(data);
                this.idCounter = this.carts.length !== 0 ? this.carts[this.carts.length - 1].id : 0;
                console.log(`Archivo ${this.path} cargado correctamente.`);
            } else {
                await this.write();
            }
        } catch (error) {
            console.error(`Error al leer el archivo ${this.path}: ${error}`);
        }
    }

    async write() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            console.log(`Archivo ${this.path} guardado correctamente.`);
        } catch (error) {
            console.error(`Error al escribir el archivo ${this.path}: ${error}`);
        }
    }

    async createCart() {
        this.idCounter++;
        const cart = { id: this.idCounter, products: [] };
        this.carts.push(cart);
        await this.write(); // Asegúrate de esperar la operación de escritura
        return cart; // Devuelve el carrito recién creado
    }

    getCarts() {
        return this.carts;
    }

    getCartById(cid) {
        const cart = this.carts.find((cart) => cart.id == cid);
        return cart || null;
    }

    async addProductToCart(cid, pid) {
        if (!pid) {
            throw new Error("Missing product ID");
        }

        const cart = this.getCartById(cid);

        if (!cart) {
            throw new Error("Cart not found");
        }

        const productIndex = cart.products.findIndex((prod) => prod.pid == pid);

        if (productIndex === -1) {
            // Si el producto no existe en el carrito, se agrega con cantidad 1
            cart.products.push({ pid, quantity: 1 });
        } else {
            // Si el producto ya existe en el carrito, se incrementa la cantidad en 1
            cart.products[productIndex].quantity += 1;
        }

        await this.write();
        return cart;
    }

    async deleteProductFromCart(cid, pid) {
        if (!pid) {
            throw new Error("Missing product ID");
        }

        const cart = this.getCartById(cid);

        if (!cart) {
            throw new Error("Cart not found");
        }

        const productIndex = cart.products.findIndex((prod) => prod.pid == pid);

        if (productIndex === -1) {
            throw new Error("Product not found in cart");
        }

        if (cart.products[productIndex].quantity > 1) {
            // Si la cantidad es mayor que 1, se reduce en 1
            cart.products[productIndex].quantity -= 1;
        } else {
            // Si la cantidad es 1, se elimina completamente el producto del carrito
            cart.products.splice(productIndex, 1);
        }

        await this.write();
        return cart;
    }

    async deleteCart(cid) {
        const index = this.carts.findIndex((cart) => cart.id == cid);

        if (index === -1) {
            throw new Error("Cart not found");
        }

        this.carts.splice(index, 1);
        await this.write();
        return "Cart deleted";
    }
}

export default CartManager;
