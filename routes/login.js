require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('../DB/userSchema');
const userModel = mongoose.model("users", userSchema);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();


router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //check if all data for login are there
    if (email === undefined || password === undefined) {
        return res.status(400).json({'message':'login error'});
    }

    try {
        const user = await userModel.findOne({email});

        if (!user) {
            //user does not exist in DM
            console.error('user does not exist in DB');
            return res.status(400).json({'message':'login error', 'code' : 400});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // wrong password
            console.error('wrong password');
            return res.status(400).json({'message':'login error', 'code' : 400});
        }
        const token = jwt.sign({email : user.email}, process.env.JWT_SECRET, {expiresIn:"1h"});
        res.cookie('token',token);
        return res.status(200).json({message : "login success", 'code' : 200});
        // maybe add redirect here TODO
        
    } catch (error) {

        console.error("server error");
        console.error(error);
        return res.status(500).json({message : "server error", 'code' : 500});

    }
})





module.exports = router;