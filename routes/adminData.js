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
    if (userData.role === "admin") {
        let pageToGet = req.body.page; 
        if (pageToGet === undefined) {
            return res.status(400).json({'message':'server error', 'code' : 400})
        }
        let nData = 10;
        let dataArr = await userModel.find({'role':{$ne : 'admin'}}, {'name':1,'email':1,'role':1,'banned':1,'telegram':1}).skip((pageToGet - 1) * nData).limit(nData);

        return res.status(200).json({'message' : 'admin verified', 'code' : 200, 'dataArr' : dataArr})
    } else {
        return res.status(400).json({'message':'cookie error', 'code' : 400})
    }
})



module.exports = router;