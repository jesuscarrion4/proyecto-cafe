import { promises as fs } from "fs";
import { createHash } from "crypto";
import path from "path";

class ProductManager {
  #products;
  #filePath;

  constructor(filePath) {
    this.#products = [];
    this.#filePath = filePath;
  }

  async initialize() {
    try {
      await fs.mkdir(path.dirname(this.#filePath), { recursive: true });
      const data = await fs.readFile(this.#filePath, "utf-8");
      this.#products = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn("Archivo no encontrado, se creará uno nuevo.");
        this.#products = [];
      } else {
        console.error(
          "Error al inicializar el gestor de productos:",
          error.message
        );
      }
    }
  }

  async saveToFile() {
    try {
      await fs.writeFile(
        this.#filePath,
        JSON.stringify(this.#products, null, 2),
        "utf-8"
      );
      console.log("Datos guardados en el archivo:", this.#filePath);
    } catch (error) {
      console.error("Error al guardar datos en el archivo:", error.message);
    }
  }

  async create(data) {
    try {
      await this.#simulateAsyncOperation();

      // Validar que todos los datos sean proporcionados
      const requiredFields = [
        "title",
        "description",
        "price",
        "img",
        "code",
        "stock",
        "category",
        "status",
        "thumbnails"
      ];

      for (const field of requiredFields) {
        if (!data.hasOwnProperty(field)) {
          throw new Error(`El campo ${field} es obligatorio.`);
        }
      }

      const newProduct = {
        id: await this.#generateId(),
        title: data.title,
        description: data.description,
        price: data.price,
        img: data.img,
        code: data.code,
        stock: data.stock,
        category: data.category,
        status: data.status,
        thumbnails: data.thumbnails,
      };

      this.#products.push(newProduct);
      console.log("Producto creado exitosamente:", newProduct);

      await this.saveToFile();
    } catch (error) {
      console.error("Error al crear el producto:", error.message);
    }
  }

  async read() {
    return this.#products;
  }

  async readOne(id) {
    try {
      await this.#simulateAsyncOperation();

      const foundProduct = this.#products.find((product) => product.id === id);

      if (!foundProduct) {
        console.log(`No se encontró ningún producto con ID ${id}.`);
        return null;
      }

      console.log(`Producto con ID ${id}:`, foundProduct);
      return foundProduct;
    } catch (error) {
      console.error("Error al buscar el producto:", error.message);
      return null;
    }
  }

  async destroy(id) {
    try {
      await this.#simulateAsyncOperation();
      const indexToRemove = this.#products.findIndex(
        (product) => product.id === id
      );

      if (indexToRemove === -1) {
        console.log(
          `No se encontró ningún producto con ID ${id}. No se eliminó nada.`
        );
        return;
      }

      const removedProduct = this.#products.splice(indexToRemove, 1)[0];
      console.log(`Producto eliminado con éxito:`, removedProduct);

      await this.saveToFile();
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
    }
  }

  async update(id, data) {
    try {
      await this.#simulateAsyncOperation();

      const productToUpdateIndex = this.#products.findIndex(
        (product) => product.id === id
      );

      if (productToUpdateIndex === -1) {
        console.log(
          `No se encontró ningún producto con ID ${id}. No se realizó ninguna actualización.`
        );
        return;
      }

      const updatedProduct = {
        ...this.#products[productToUpdateIndex],
        ...data,
        id: this.#products[productToUpdateIndex].id, // Asegurar que el ID no cambie
      };

      this.#products[productToUpdateIndex] = updatedProduct;
      console.log("Producto actualizado con éxito:", updatedProduct);

      await this.saveToFile();
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
    }
  }

  async #generateId() {
    try {
      const hash = createHash("sha256");
      hash.update(Date.now().toString());
      return hash.digest("hex").slice(0, 8); // Utiliza los primeros 8 caracteres para el ID
    } catch (error) {
      console.error("Error al generar ID:", error.message);
    }
  }

  async #simulateAsyncOperation() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}

const filePath = "../server/src/data/products.json";
const productManager = new ProductManager(filePath);

(async () => {
  await productManager.initialize();

  // Agregar productos
  try {
    await productManager.create({
      title: "cafe americano",
      description: "description",
      price: 29.99,
      img: "ruta/imagen1.jpg",
      code: "10",
      stock: 50,
      category: "category",
      status: true,
      thumbnails: []
    });

    await productManager.create({
      title: "cafe amarillo",
      description: "description",
      price: 29.99,
      img: "ruta/imagen2.jpg",
      code: "11",
      stock: 50,
      category: "category",
      status: true,
      thumbnails:  []
    });
  } catch (error) {
    console.error("Error al agregar productos:", error.message);
  }

  const allProducts = await productManager.read();
  console.log("Todos los productos:", allProducts);

  const productIdToFind = allProducts[0].id;  // Utilizando el mismo tipo para IDs
  await productManager.readOne(productIdToFind);

  // Actualizar un producto por ID
  const productIdToUpdate = allProducts[0].id; // Asegurando el ID correcto
  const updatedData = {
    title: "cafe descafeinado",
    price: 49.99,
    stock: 20,
  };
  await productManager.update(productIdToUpdate, updatedData);

  // Mostrar todos los productos después de la actualización
  const updatedProducts = await productManager.read();
  console.log(
    "Todos los productos después de la actualización:",
    updatedProducts
  );

  // Eliminar un producto por ID
  const productIdToDelete = allProducts[0].id; // Asegurando el ID correcto
  await productManager.destroy(productIdToDelete);
})();

export default ProductManager;