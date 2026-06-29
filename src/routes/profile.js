const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/validation');
const bcrypt = require('bcrypt');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        console.log("User details", req.user);
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).send(error.message ? error.message : 'Error fetching profile');
    }

});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error('Invalid edit request!!');
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();
        res.json("Profile updated successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { newPassword } = req.body;
        if (!newPassword) {
            throw new Error('New password is required');
        }

        const isPasswordValid = await bcrypt.compare(newPassword, loggedInUser.password);
        if (isPasswordValid) {
            throw new Error('New password cannot be the same as the old password');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();
        res.json("Password updated successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

module.exports = profileRouter;