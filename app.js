// const path =  require('path');
// const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
var cors = require('cors');


const Userdb = require('./models/user');
const Expensedb = require('./models/expense');

const userRoutes = require('./routes/user');
const expenseRoutes =require('./routes/expense');
const Expense = require('./models/expense');
// const purchaseRoutes = require('./routes/purchase');
// const premiumRoutes = require('./routes/premium');
// const passwordRoutes = require('./routes/password');

const app = express();
app.set('view engine', 'ejs');
app.use(cors());

app.use(bodyParser.json({ extended: false }));
app.use(express.static('views'));

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
// app.use('/purchase', purchaseRoutes);
// app.use('/premium', premiumRoutes);
// app.use('/password', passwordRoutes);

Userdb.hasMany(Expensedb);
Expensedb.belongsTo(Userdb);

sequelize.sync({force: true}).then((result) => {
    app.listen(3000);
}).catch((error) => {
    console.log(error);
});