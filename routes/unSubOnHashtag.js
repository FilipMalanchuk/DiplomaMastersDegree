const express = require('express');

const tokenVerification = require('./tokenVerification');
const mongoose = require('mongoose');
const userSchema = require('../DB/userSchema');
const userModel = mongoose.model("users", userSchema);


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let verifyObj = tokenVerification(req, res);

        if (!verifyObj.verified) {
            res.clearCookie('token');
            // token not verified
            return res.status(400).json({ 'message': 'cookie error', 'code': 400 })
        }
        // token verified

        //updating document
        let userEmail = verifyObj.user.email;
        let userData = await userModel.findOne({ 'email': userEmail });
        let subscriptions = userData.subscriptions;
        //check if already subscribed
        if (!subscriptions.includes(req.body.hashtagName)) {
            return res.status(200).json({
                message: "Already unsubscribed",
                code: 200,
                subscriptions: subscriptions
            })
        }
        subscriptions = subscriptions.filter(sub => sub !== String(req.body.hashtagName));
        let updateSubs = await userModel.findOneAndUpdate({ _id: userData._id }, { subscriptions: subscriptions }, { returnDocument: 'after' })


        return res.status(200).json({
            message: "Unsubscribed",
            code: 200,
            subscriptions: subscriptions
        })
    } catch (error) {
        console.log("getFeed.js error");
        console.log(error);
    }

})



module.exports = router;