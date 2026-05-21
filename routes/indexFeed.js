const express = require('express');

const tokenVerification = require('./tokenVerification');
const mongoose = require('mongoose');
const userSchema = require('../DB/userSchema');
const userModel = mongoose.model("users", userSchema);

const router = express.Router();

router.post('/', async (req, res) => {
    let verifyObj= tokenVerification(req,res);

    if (!verifyObj.verified){
        res.clearCookie('token');
        // token not verified
        return res.status(400).json({'message':'cookie error', 'code' : 400})
    }
    // token verified
    let userEmail = verifyObj.user.email;
    let userData = await userModel.findOne({'email' : userEmail});
    return res.status(200).json({
        'message' : "user data recieved", 
        'code' : 200, 
        'user' : {
            'name' : userData.name,
            'email' : userData.email, 
            'role' : userData.role, 
            'banned' : userData.banned,
            'subscriptions' : userData.subscriptions
        }
    })
})



module.exports = router;