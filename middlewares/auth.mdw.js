const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
        try {
            jwt.verify(accessToken, 'SECRET_KEY');
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({
                message: 'Invalid access token!'
            })
        }
    } else {
        return res.status(400).json({
            message: 'Access token not found!'
        })
    }
}