require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userSchema = require('./DB/userSchema');
const hashtagsSchema = require('./DB/hashtagsSchema');
const articleSchema = require("./DB/articleSchema");
const registerRoute = require("./routes/registration");
const loginRoute = require("./routes/login");

const app = express()
app.use(express.json())
app.use(express.static(__dirname + "/frontend"));

const port = 3000



app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);



// pages routes
app.get(['/loginPage'], (req, res) => {
    res.sendFile("frontend/login.html", { root: __dirname })
})
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile("frontend/index.html", { root: __dirname })
})
// todo route 404





// db change to another folder

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.error(err)
    }
}

connectDB()

// after connecting to DB, app listens port
mongoose.connection.once('open', () => {
    console.log("connected to MongoDB");

    app.listen(port, 'localhost', (error) => {
        error ? console.log(error) : console.log(`listening port ${port}`);
    });
})




// test connects
const hashtagsModel = mongoose.model("hashtags",hashtagsSchema);
const articleModel = mongoose.model("articles",articleSchema);

// get data drom DB
// app.get("/getUsers", async (req, res) => {
//     const userData = await userModel.find();
//     res.json(userData);
// })

// save new data
// app.get("/setUser", async (req, res) => {
//     let hashTagsJsonArray = [];
//     let testArr = ['Sport','Fashion','Politics','Health','Style','Travel','World','Climate','Business','Weather']
//     for(let i = 0; i <10;i++) {
//         hashTagsJsonArray.push(new hashtagsModel({hashtagName : `${testArr[i]}`}))
//     }
//     hashtagsModel.bulkSave(hashTagsJsonArray)
// })
