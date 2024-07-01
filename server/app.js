const express = require('express');
const { create } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let products = require('./products.json');

app.get('/products', (req, res) => {
    res.render('index', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

app.post('/products', (req, res) => {
    const { name, price, description } = req.body;
    const newProduct = { id: products.length + 1, name, price, description };
    products.push(newProduct);
    fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products));
    io.emit('newProduct', newProduct);
    res.redirect('/products');
});

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('deleteProduct', (id) => {
        products = products.filter(product => product.id !== id);
        fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products));
        io.emit('updateProducts', products);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
