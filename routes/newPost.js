const express = require('express');
const multer = require("multer");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const tokenVerification = require('./tokenVerification');
const mongoose = require('mongoose');
const userSchema = require('../DB/userSchema');
const userModel = mongoose.model("users", userSchema);

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
    let verifyObj= tokenVerification(req,res);

    if (!verifyObj.verified){
        res.clearCookie('token');
        // token not verified
        return res.status(400).json({'message':'cookie error', 'code' : 400})
    }
    // token verified
    let userEmail = verifyObj.user.email;
    let userData = await userModel.findOne({'email' : userEmail});

    // check if user has the authority to post
    if (userData.role === 'user') {
        return res.status(400).json({'message':'Authority error', 'code' : 400})
    }
    let reqBody = req.body;
    console.log('req.body ', reqBody);
    console.log('req.file', req.file)






    return res.status(200).json({
        'message' : "user data recieved", 
        'code' : 200, 
        'user' : {
            'name' : userData.name,
            'email' : userData.email, 
            'role' : userData.role, 
            'banned' : userData.banned
        }
    })
})



module.exports = router;