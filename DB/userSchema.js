const mongoose = require('mongoose');
const hashtagsSchema = require('./hashtagsSchema')

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    role : {type : String, default : "user"},
    login : String,
    password : String,
    Banned : {type : Boolean, default : false},
    createdAt : {type : Date, default : Date.now},
    subscriptions : {type : [hashtagsSchema]},
    Telegram : {type : String, default : 'noInfo'}
})

module.exports = userSchema;