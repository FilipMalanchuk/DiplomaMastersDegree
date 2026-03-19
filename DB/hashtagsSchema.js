const mongoose = require('mongoose');

const hashtags = new mongoose.Schema({
    hashtagName : String
})
module.exports = hashtags;