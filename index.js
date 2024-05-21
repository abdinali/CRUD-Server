const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError');

const port = 8080;

const Product = require('./models/product');

main()
	.then((res) => console.log('MONGO CONNECTION OPEN'))
	.catch((err) => console.log('MONGO CONNECTION ERROR: ', err));

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/farmStand2');
}

function handleValidationErr(err) {
	console.dir(err);
	return new AppError(`Validation Failed: ${err.message}`, 400);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

function handleAsync(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((e) => next(e));
	};
}
app.get(
	'/products',
	handleAsync(async (req, res, next) => {
		const { category } = req.query;
		if (category) {
			const products = await Product.find({ category }); // filter for specific products
			res.render('products/index', { products, category });
		} else {
			const products = await Product.find({}); // find all products
			res.render('products/index', { products, category: 'All' });
		}
	})
);

// Form For New Products
app.get(
	'/products/new',
	handleAsync(async (req, res) => {
		const categories = await Product.getCategories();
		res.render('products/new', { categories }); // render form
	})
);

// Form Submission
app.post(
	'/products',
	handleAsync(async (req, res, next) => {
		const newProduct = new Product(req.body);
		await newProduct.save();
		res.redirect(`/products/${newProduct._id}`); // redirect to details page
	})
);

app.get(
	'/products/:id',
	handleAsync(async (req, res, next) => {
		const { id } = req.params;
		const selectedProduct = await Product.findById(id); // find specific product from id
		if (!selectedProduct) {
			throw new AppError('Product Not Found', 404);
		}
		res.render('products/show', { selectedProduct });
	})
);

// Form For Updating Products
app.get(
	'/products/:id/edit',
	handleAsync(async (req, res, next) => {
		const { id } = req.params;
		const selectedProduct = await Product.findById(id);
		const categories = await Product.getCategories();
		if (!selectedProduct) {
			throw new AppError('Product Not Found', 404);
		}
		res.render('products/edit', { selectedProduct, categories });
	})
);

app.put(
	'/products/:id',
	handleAsync(async (req, res) => {
		const { id } = req.params;
		updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		res.redirect(`/products/${updatedProduct._id}`);
	})
);

// Delete Product
app.delete(
	'/products/:id',
	handleAsync(async (req, res) => {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		res.redirect('/products');
	})
);

app.use((err, req, res, next) => {
	console.log(err.name);
	if (err.name === 'ValidationError') err = handleValidationErr(err);
	next(err);
});

app.use((err, req, res, next) => {
	const { status = 500, message = 'Something went wrong' } = err;
	res.status(status).send(message);
});

app.listen(port, () => {
	console.log(`LISTENING ON PORT ${port}!`);
});
