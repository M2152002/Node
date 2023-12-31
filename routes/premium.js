const express = require('express')

const authenticateUser = require('../middlewares/auth');
const premiumControllers = require('../controllers/premium');

const router = express.Router()

router.get('/showLeaderBoard', authenticateUser.authenticate, premiumControllers.getUserLeaderBoard )


module.exports = router;