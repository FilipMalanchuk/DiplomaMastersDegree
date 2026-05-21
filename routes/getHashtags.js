const express = require('express');
const mongoose = require('mongoose');

const hashtagsSchema = require('../DB/hashtagsSchema');
const hashtagsModel = mongoose.model("hashtags", hashtagsSchema);


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // getting 100 hashtags from DB
        let data = await hashtagsModel.find().select('hashtagName -_id').limit(100);
        

        return res.status(200).json({
            message : "hashtagsDataRecieved",
            code : 200,
            hashtags : data
        })
    } catch(error) {
        console.log("getFeed.js error");
        console.log(error);
    }
    
})



module.exports = router;