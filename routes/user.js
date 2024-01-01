const express = require('express');

const userController = require('../controllers/user');

const authenticatemiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.login);


module.exports = router;