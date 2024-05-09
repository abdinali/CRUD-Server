const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

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
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.get('/products', async (req, res) => {
    const products = await Product.find({}); // find all products
    res.render('products/index', { products });
})

// Form For New Products
app.get('/products/new', (req, res) => {
    res.render('products/new'); // render form
})

// Form Submission
app.post('/products', async (req, res) => {
    const newProduct = await new Product(req.body);
    newProduct.save();
    res.redirect(`/products/${newProduct._id}`); // redirect to details page
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const selectedProduct = await Product.findById(id); // find specific product from id
    res.render('products/show', { selectedProduct });
})

// Form For Updating Products
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const selectedProduct = await Product.findById(id);
    res.render('products/edit', { selectedProduct });
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
    res.redirect(`/products/${updatedProduct._id}`);
})

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}!`)
})