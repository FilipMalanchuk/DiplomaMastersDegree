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
    let adminEmail = verifyObj.user.email;
    let userData = await userModel.findOne({'email' : adminEmail});
    if (userData.role === "admin") {
        let result = await userModel.updateOne({'email' : req.body.email}, {"$set" : {'role' : req.body.role, 'banned' : req.body.banned}});
        if (result.modifiedCount === 1) {
            return res.status(200).json({'message' : 'data changed', 'code' : 200});
        } else {
            return res.status(400).json({'message':'error', 'code' : 400});
        }
    } else {
        return res.status(400).json({'message':'cookie error', 'code' : 400});
    }
})



module.exports = router;