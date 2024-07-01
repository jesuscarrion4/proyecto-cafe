const socket = io();

document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');

    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, description })
    });
});

socket.on('newProduct', function(product) {
    const productItem = document.createElement('li');
    productItem.id = `product-${product.id}`;
    productItem.className = 'product-item';
    productItem.innerHTML = `<h2>${product.name}</h2>
                             <p>${product.description}</p>
                             <p>$${product.price}</p>
                             <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
    document.getElementById('product-list').appendChild(productItem);
});

socket.on('updateProducts', function(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.id = `product-${product.id}`;
        productItem.className = 'product-item';
        productItem.innerHTML = `<h2>${product.name}</h2>
                                 <p>${product.description}</p>
                                 <p>$${product.price}</p>
                                 <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
        productList.appendChild(productItem);
    });
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}
