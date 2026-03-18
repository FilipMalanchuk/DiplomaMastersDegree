const express = require('express');


const app = express()

const port = 3000

app.listen(port,'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${port}`);
});


//routes
app.get(['/','/index.html'], (req, res) => {
    res.sendFile("frontend/index.html",{root: __dirname})
})
