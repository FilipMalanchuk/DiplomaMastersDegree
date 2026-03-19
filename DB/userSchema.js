const mongoose = require('mongoose');
const hashtagsSchema = require('./hashtagsSchema');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    role : {type : String, default : "user"},
    password : String,
    banned : {type : Boolean, default : false},
    createdAt : {type : Date, default : Date.now},
    subscriptions : {type : [hashtagsSchema]},
    telegram : {type : String, default : 'noInfo'}
})

// hash password
userSchema.pre('save', async function() {
    if(!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10);
})

module.exports = userSchema;