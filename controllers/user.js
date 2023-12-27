const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// function isStringInvalid(string) {
//     if(string === undefined || string.length === 0) {
//         return true;
//     }else {
//         return false;
//     }
// }

exports.signup = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        // if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phone) || isStringInvalid(password)) {
        //     return res.status(400).json({error: "Bad parameters Something is missing"});
        // } 
        const oldUser = await User.findOne({
            email : email
        })
        if(oldUser) {
            res.status(404).json({ message: "User Already Exists!"});
        }
        else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if(err) {
                    return res.status(500).json({ error: "Error hashing password"});
                }
                await User.create({ name, email, phone, password: hash });
                res.status(201).json({message: "Sucessfully created new user"});
            })
        } 
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.login = async (req,res,next) => {
    try{
        const { email, password } = req.body;
        // if(isStringInvalid(email) || isStringInvalid(password)) {
        //     return res.status(400).json({message: "Email id or password is missing", success:false});
        // } 
        const user = await User.findOne({where:{ email : email } })
        if(!user) {
            res.status(404).json({message : "User Not Found !!!"})
        }
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result){
                    res.status(200).json({success: true, message: "User logged in successfully"});
                }
                else{
                    res.status(401).json({success: false, message : "Password is incorrect"});
                }
            })
        }   
    }
    catch(err){
        res.status(500).json({message : err, success: false});
    }
}