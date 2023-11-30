const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

router.get('/', (req, res, next)=> {
    res.sedFile(path.join(rootDir, 'contact.html'));
});

router.post('/submit', (req, res, next)=> {
    const name = req.body.name;
    const email = req.body.email;

    res.redirect('/success');
});

module.exports = router;
