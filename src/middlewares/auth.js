const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {// Read the token from Req cookies
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Token not found');
        }
        // Validate the token 
        const decodedToken = jwt.verify(token, "DEV@Tinder$007");
        const { _id } = decodedToken;

        // find the user
        const userData = await User.findById(_id);
        if (!userData) {
            throw new Error('User not found');
        }
        req.user = userData;
        next();
    } catch (error) {
        res.status(400).json("Error: " + (error.message ? error.message : 'Invalid token'));
    }
};

module.exports = {
    userAuth
}