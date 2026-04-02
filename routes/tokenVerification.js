require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/", async (req, res) => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({'message' : "user data recieved", 'code' : 200})
    } catch (error) {
        res.clearCookie('token');
        return res.status(400).json({'message':'cookie error', 'code' : 400})
    }
})







module.exports = router;