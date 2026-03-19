const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('../DB/userSchema');

const userModel = mongoose.model("users", userSchema);


const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, password, telegram } = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Add all required data for registration" });
        };

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        };
        const newUser = await userModel.create({ name, email, password, telegram });
        res.status(201).json({ message: "User created" })
    } catch (err) {
        console.log(err);
        res.status(500).json({message : "error on server"});
    };
});

module.exports = router;