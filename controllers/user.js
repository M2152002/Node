const User = require('../models/user');

const becrypt = require('bcrypt');

function isstringinvalid(stribg) {
    if(string === undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

exports.signup = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        console.log('email', email);
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(phone) || isstringinvalid(password)) {
            return res.status(400).json({error: "Bad parameters Something is missing"})
        } 

        const saltRounds = 10;
        becrypt.hash(password, saltRounds, async(err, hash) => {
            console.log(err);
            await User.create({ name, email, phone, password: hash })
            res.status(201).json({message: "Sucessfully created new user"});
        })  
    }
    catch(err) {
        res.status(500).json(err);
    }
}

exports.Login = async (req,res,next) => {
    try{
        const { email, password } = req.body;
        if(isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({message: "Email id password is missing", success:false})
        } 
        console.log(password);
        const user = await User.findAll({where:{ email : email } })
        if(user.length> 0){
            becrypt.compare(password, user[0].password, (err, result) => {
                if(err) {
                    res.status(500).json({ success: false, message: 'Something went wrong' })
                }
                if(result === true){
                    res.status(200).json({success: true, message: "User logged in successfully"})
                }
                else{
                    res.status(404).json({success: false, message : "Password is incorrect"})
                }
            })
        }
        else{
            res.status(404).json({success: false, message : "User doesn't exists"})
        }
    }
    catch(err){
        res.status(500).json({message : err, success: false})   
    }
}