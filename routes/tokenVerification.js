const jwt = require('jsonwebtoken');

function tokenVerify (req, res) {
    const token = req.cookies.token;
    let user = {}
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return {'verified':true,'user' : user}
    } catch (error) {
        res.clearCookie('token');
        return {'verified':false,'user' : user}
    }
}

module.exports = tokenVerify;