const mongoose = require('mongoose');

const article = new mongoose.Schema({
    headline : {type : String, default : "No Headline"},
    articleText : {type : String, default : "No Text"},
    imageName : {type : String, default : "No Name"},
    imageOriginalName : {type : String, default : "No Name"},
    articleTags : [String]
})

module.exports = article;