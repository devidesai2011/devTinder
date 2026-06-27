const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        console.log("User details", req.user);
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).send(error.message ? error.message : 'Error fetching profile');
    }

});

module.exports = profileRouter;