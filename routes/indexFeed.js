const express = require('express');

const tokenVerification = require('./tokenVerification');

const router = express.Router();

router.post('/', (req, res) => {
    let verifyArr= tokenVerification(req,res);

    if (!verifyArr.verified){
        res.clearCookie('token');
        // token not verified
        return res.status(400).json({'message':'cookie error', 'code' : 400})
    }
    // token verified
    return res.status(200).json({'message' : "user data recieved", 'code' : 200})
})



module.exports = router;