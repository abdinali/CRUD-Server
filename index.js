const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const port = 3000;

const Product = require('./models/product');

main()
    .then((res) => console.log('MONGO CONNECTION OPEN'))
    .catch((err) => console.log('MONGO CONNECTION ERROR: ', err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/products', async (req, res) => {
    const products = await Product.find({}) // find all products
    res.render('products/index', { products });
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const selectedProduct = await Product.findById(id);
    res.render('products/show', { selectedProduct });
})

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}!`)
})