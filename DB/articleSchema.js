const mongoose = require('mongoose');

const article = new mongoose.Schema({
    headline : {type : String, default : "No Headline"},
    articleText : {type : String, default : "No Text"},
    imageName : {type : String, default : "No Image"},
    articleTags : [String]
})

module.exports = article;