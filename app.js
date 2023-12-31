// const path =  require('path');
// const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const sequelize = require('./util/database');


const Userdb = require('./models/user');
const Expensedb = require('./models/expense');
const Orderdb = require('./models/order');

const userRoutes = require('./routes/user');
const expenseRoutes =require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
// const passwordRoutes = require('./routes/password');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static('views'));

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
// app.use('/password', passwordRoutes);

Userdb.hasMany(Expensedb);
Expensedb.belongsTo(Userdb);

Userdb.hasMany(Orderdb);
Orderdb.hasMany(Userdb);

sequelize.sync().then((result) => {
    app.listen(3000);
}).catch((error) => {
    console.log(error);
});