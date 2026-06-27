const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
    // Validation of Data
    try {
        validateSignUpData(req);

        // Encrypt the password
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        // Store user in data base
        // Creating a new instance  of user model
        const { firstName, lastName, email } = req.body;
        const user = new User({ firstName, lastName, email, password: passwordHash });
        user.save().then(() => {
            res.status(201).send('User created successfully');
        }).catch((err) => {
            res.status(500).send(err.message ? err.message : 'Error creating user');
        });

    } catch (error) {
        return res.status(400).send(error.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).send('Invalid email format');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Invalid Credentials');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (isPasswordValid) {

            //Create a JWT token
            const token = await user.getJWT();
            // Add token to cookie and send response back to user.
            res.cookie("token", token, { expires: new Date(Date.now() + 5 * 10000), httpOnly: true });
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send(error.message ? error.message : 'Error logging in');
    }
});

module.exports = authRouter;