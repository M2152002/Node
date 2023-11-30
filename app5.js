const path = require('path');

const  express  = require('express'); 
const bodyParser = require('body-parser');

const errorController = require('../controllers/error');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const contactRoutes = require('./routes/contact');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); // filtering paths
app.use(shopRoutes);
app.use('/contactus', contactRoutes);

app.get('/success', (req, res, next) => {
    res.send('<h1>Form successfully filled</h1>');
});

app.use(errorController.get404);

app.listen(3000);
