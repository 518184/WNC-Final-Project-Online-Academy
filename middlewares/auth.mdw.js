const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports = async function (req, res, next) {
    const accessToken = req.headers['x-access-token'];
    if (accessToken) {
        try {
            const { userId } = jwt.verify(accessToken, 'SECRET_KEY');
            const user = await userModel.single(userId);
            if (user === null) {
                return res.status(404).json({
                    message: 'User doesn\'t exist'
                });
            }
            req.headers.userId = userId;
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({
                message: 'Invalid access token!'
            });
        }
    } else {
        return res.status(400).json({
            message: 'Access token not found!'
        });
    }
}