const express = require('express');
const multer = require("multer");
const { S3Client, PutObjectCommand, Bucket$ } = require("@aws-sdk/client-s3");
const { randomBytes } = require("node:crypto");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const tokenVerification = require('./tokenVerification');
const mongoose = require('mongoose');
const userSchema = require('../DB/userSchema');
const userModel = mongoose.model("users", userSchema);
const articleSchema = require('../DB/articleSchema');
const articleModel = mongoose.model('articles', articleSchema);

const sendNewHashtags = require('../backScripts/sendNewHashtags')

const router = express.Router();

// s3 bucket
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})

function getRandomName() {
    return randomBytes(32).toString("hex");
}

router.post('/', upload.single('image'), async (req, res) => {
    let verifyObj = tokenVerification(req, res);

    if (!verifyObj.verified) {
        res.clearCookie('token');
        // token not verified
        return res.status(400).json({ 'message': 'cookie error', 'code': 400 })
    }
    // token verified
    let userEmail = verifyObj.user.email;
    let userData = await userModel.findOne({ 'email': userEmail });

    // check if user has the authority to post
    if (userData.role === 'user') {
        return res.status(400).json({ 'message': 'Authority error', 'code': 400 })
    }

    try {
        // data handling 
        let reqBody = req.body;
        console.log('req.body ', reqBody);
        console.log('req.file', req.file);

        // create new tags in DB if they didnt exist there already
        if ('tags' in reqBody) {
            sendNewHashtags(reqBody.tags);
        }
        //s3
        // random name for s3bucket
        let randomName = '';
        let fileNameOriginal = ''

        // check if there is a File with an article to save into s3 bucket
        if (typeof req.file !== "undefined") {
            randomName = getRandomName();
            fileNameOriginal = req.file.originalname;

            // image params to save
            const params = {
                Bucket: bucketName,
                Key: randomName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            }
            const command = new PutObjectCommand(params);

            await s3.send(command);
        }


        // splitting string of tags into arr to save into DB
        let hashtagsArr = [];
        if (req.body.tags.length > 0) {
            hashtagsArr = req.body.tags.split(",");
            hashtagsArr = hashtagsArr.filter(x => x !== "");
            // TODO add a clause to remove dublicate tags [ 'Politics', 'Politics', 'Test', 'Patrick' ]
        }

        // sending data to DB
        let article = await articleModel.create({
            headline: req.body.headline,
            articleText: req.body.articleText,
            imageName: randomName,
            imageOriginalName : fileNameOriginal,
            articleTags: hashtagsArr
        })

        return res.status(200).json({
            'message': "Article created",
            'code': 200
        })
    } catch (error) {
        console.log("error during newPost creation");
        console.log(error);
    }
    return res.status(400).json({ 'message': 'Error during article creation', 'code': 400 })

})



module.exports = router;