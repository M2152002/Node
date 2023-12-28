const User = require('../models/user');
// const FilesDownloaded = require('../models/filesdownloaded')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// const dotenv =  require("dotenv");
// dotenv.config();

exports.signup = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        const oldUser = await User.findOne({where:  { email : email } 
        });
        if(oldUser) {
            res.status(409).json({ message: "User Already Exists!"});
        }
        else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                const user = new User({ 
                    name: name, 
                    email: email,
                    phone: phone,
                    password: hash 
                })
                await user.save()
                res.status(200).json({message: "Sucessfully created new user"});
            })
        } 
    }
     catch(err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({ id: id, name: name}, JWT_SECRET_KEY);
}


exports.login = async (req,res,next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({where:{ email : email } })
        if(!user) {
            res.status(404).json({message : "User Not Found !!!"})
        }
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result){
                    res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(user.id, user.name) });
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

// exports.getPremium = (req,res,next) => {
//     const user = req.user;
//     if(user){
//         return res.status(200).json({isPremium : user.isPremium})
//     }
// }

// exports.getFilesDownloaded = async (req, res, next) => {
//     try{
//         const user = req.user;
//         const filesdownloaded = await FilesDownloaded.find({ userId : user.id }).select('fileUrl date')
//         res.status(200).json(filesdownloaded)
//     }
//     catch(err){
//         console.log(err);
//     }
// }