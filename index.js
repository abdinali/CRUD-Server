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

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}!`)
})