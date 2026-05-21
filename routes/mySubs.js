const express = require('express');
const signImageUrlAndAttackToData = require('../backScripts/signImageUrlAndAttackToData');


const tokenVerification = require('./tokenVerification');
const mongoose = require('mongoose');

const userSchema = require('../DB/userSchema');
const userModel = mongoose.model('users',userSchema);
const articleSchema = require('../DB/articleSchema');
const articleModel = mongoose.model("articles", articleSchema);


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let verifyObj = tokenVerification(req, res);

        if (!verifyObj.verified) {
            res.clearCookie('token');
            // token not verified
            return res.status(400).json({ 'message': 'cookie error', 'code': 400 })
        }
        let userEmail = verifyObj.user.email;
        let userData = await userModel.findOne({'email' : userEmail});
        // getting last 10 * page articles from DB that has tag as in user Subscriptions
        let data = await articleModel.find({articleTags : {$in : userData.subscriptions}}).sort({ _id: -1 }).skip(req.body.page * 10).limit(10);

        
        let dataWithImageUrl = await signImageUrlAndAttackToData(data)
        return res.status(200).json({
            message: "articlesDataRecieved",
            code: 200,
            articles: dataWithImageUrl
        })
    } catch (error) {
        console.log("getFeed.js error");
        console.log(error);
    }

})



module.exports = router;