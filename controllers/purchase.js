const Razorpay = require('razorpay');

const dotenv =  require("dotenv");
dotenv.config()


const Order = require('../models/order')
const userController = require('./user')

exports.purchasePremium = async (req, res, next) => {
    try {
         var rzp = new Razorpay({
             key_id: process.env.RAZORPAY_KEY_ID,
             key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        // var rzp = new Razorpay({
        //    key_id: 'rzp_test_PNRd3eZHZ1ZKbC',
        //    key_secret: '03J777w3Re8GuHxN8xWCDTgF'
        // })
        const amount = 100;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                console.error("Razorpay Order Creation Error:", err);
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } }); 
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({
                sucess: true, 
                message: "Transaction Successful", 
                token: userController.generateAccessToken(userId, undefined, true) });
        }).catch((error ) => {
            throw new Error(error)
        })          
    } 
    catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Something went wrong' })

    }
}