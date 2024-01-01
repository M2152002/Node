const User = require('../models/user');
const bcrypt = require('bcrypt')
const saltrounds = 10;

const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const dotenv =  require("dotenv");
dotenv.config();

function isstringinvalid(string){
    if(string == undefined ||string.length === 0){
        return true
    } else {
        return false
    }
}

exports.signup = async (req, res)=>{
    try{
    const { name, email, password } = req.body;
    console.log('email', email)
    if(isstringinvalid(name) || isstringinvalid(email || isstringinvalid(password))){
        return res.status(400).json({err: "Bad parameters . Something is missing"})
    }
    bcrypt.hash(password, saltrounds, async (err, hash) => {
        if (err) {
            throw new Error('Error hashing password');
        }
        console.log(err)
        await User.create({ name, email, password: hash })
        res.status(201).json({message: 'Successfuly create new user'})
    })
    }catch(err) {
            res.status(500).json({message: err.message});
        }
}

exports.generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, '98789d8cedf2f9a86af5391e930337cfe11ffc64ef0140fa8989920e2034a307494d74fe50bd5c7e3f137e56c7da3999309264ae5c29b54937c72f6c27563f28');
}

exports.login = async (req, res) => {
    try{
    const { email, password } = req.body;
    if(isstringinvalid(email) || isstringinvalid(password)){
        return res.status(400).json({message: 'EMail idor password is missing ', success: false})
    }
    console.log(password);
    const user  = await User.findAll({ where : { email }})
        if(user.length > 0){
           bcrypt.compare(password, user[0].password, (err, result) => {
           if(err){
            throw new Error('Something went wrong')
           }
            if(result === true){
                return res.status(200).json({success: true, message: "User logged in successfully", token: exports.generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser)})
            }
            else{
            return res.status(400).json({success: false, message: 'Password is incorrect'})
           }
        })
        } else {
            return res.status(404).json({success: false, message: 'User Doesnot exitst'})
        }
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
}