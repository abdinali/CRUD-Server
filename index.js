const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const port = 3000;

main()
    .then((res) => console.log('mongo connection open'))
    .catch((err) => console.log('MONGO CONNECTION ERROR: ', err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/shopApp');
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/cat', (req, res) => {
    // console.log('MEOW')
    res.send('MEOW');
})

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}!`)
})