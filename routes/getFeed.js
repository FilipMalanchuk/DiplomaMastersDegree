const express = require('express');
const signImageUrlAndAttackToData = require('../backScripts/signImageUrlAndAttackToData');


const tokenVerification = require('./tokenVerification');
const mongoose = require('mongoose');

const articleSchema = require('../DB/articleSchema');
const articleModel = mongoose.model("articles", articleSchema);


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // getting last 10 * page articles from DB 
        let data = await articleModel.find().sort({ _id: -1 }).skip(req.body.page * 10).limit(10);
        let dataWithImageUrl = await signImageUrlAndAttackToData(data)
        return res.status(200).json({
            message : "articlesDataRecieved",
            code : 200,
            articles : dataWithImageUrl
        })
    } catch(error) {
        console.log("getFeed.js error");
        console.log(error);
    }
    
})



module.exports = router;