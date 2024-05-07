const mongoose = require('mongoose');
const Product = require('./models/product');

main()
    .then((res) => console.log('MONGO CONNECTION OPEN'))
    .catch((err) => console.log('MONGO CONNECTION ERROR: ', err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
}

Product.insertMany([
    {
        name: 'Fairy Eggplant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.50,
        category: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 2.69,
        category: 'dairy'
    }
])
    .then((res) => console.log(res))
    .catch((err) => console.log(err));