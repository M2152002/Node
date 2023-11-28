const express  = require('express');  // ctrl + click
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<html><form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form></html>'); // in localhost => network tab content-type will automatically be text/html because of express js
});

app.use('/product', (req, res, next)=> {
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
    res.send('<h1>Hello from Express!</h1>'); // in localhost => network tab content-type will automatically be text/html because of express js
});

app.listen(3000);
