const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
// process.env.JWT_SECRET_KEY;

const authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, error: 'Authorization token missing' });
        }
        const user = jwt.verify(token, JWT_SECRET_KEY);
        console.log(user.userId);
        User.findByPk(user.userId).then((user) => {
            if (!user) {
                return res.status(401).json({ success: false, error: 'User not found' });
            }
            req.user = user;
            next()
        })
        .catch(err => console.log(err)) 
        
    }
    catch(err){
        console.log(err);
        return res.status(401).json({ success : false, error: 'Invalid token' })
    }
}

module.exports = { authenticate };