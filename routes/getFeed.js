const express = require('express');

const tokenVerification = require('./tokenVerification');
const mongoose = require('mongoose');

const articleSchema = require('../DB/articleSchema');
const articleModel = mongoose.model("articles", articleSchema);

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // getting last 10 * page articles from DB 
        let data = await articleModel.find().skip(req.body.page * 10).limit(10);
        console.log('data[0] ',data[0]);
        // TODO continue here


    } catch(error) {
        console.log("getFeed.js error");
        console.log(error);
    }
    
})



module.exports = router;