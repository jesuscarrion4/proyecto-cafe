const socket = io();

document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const price = formData.get('price');
    const img = formData.get('img');
    const code = formData.get('code');
    const stock = formData.get('stock');
    const category = formData.get('category');
    const status = formData.get('status');
    const thumbnails = formData.get('thumbnails');

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, price, img, code, stock, category, status, thumbnails })
    });
});

socket.on('updateProducts', function(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.id = `product-${product.id}`;
        productItem.className = 'product-item';
        productItem.innerHTML = `<h2>${product.title}</h2>
                                 <p>${product.description}</p>
                                 <p>$${product.price}</p>
                                 <img src="${product.img}" alt="${product.title}" width="100">
                                 <button onclick="deleteProduct('${product.id}')">Eliminar</button>`;
        productList.appendChild(productItem);
    });
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}
