const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const bodyParser = require('body-parser');
const loginRoute = require('./public/login');
const msgRoute = require('./public/message');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(loginRoute);
app.use(msgRoute);
app.listen(3000);
