const express = require('express');

const router = express.Router();

// router.use is used then it works for all requests like get, post, delete... 
// but when we use specific router.get and type http:localhost:3000/sometext it will show error as (can't get /sometext)
router.get('/', (req, res, next) => {
    res.send('<h1>Hello from Express!</h1>'); 
});

module.exports = router;
