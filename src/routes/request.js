const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    // Sending a conenction request
    const user = req.user;

    console.log('Sending a connection request');
    res.send(user.firstName + " " + user.lastName + " is sending a connection request");
});


module.exports = requestRouter;