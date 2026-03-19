const mongoose = require('mongoose');

const article = new mongoose.Schema({
    headline : {type : String, default : "No Headline"},
    articleText : {type : String, default : "No Text"},
    imageLink : {type : String, default : "No Image"}
})

module.exports = article;