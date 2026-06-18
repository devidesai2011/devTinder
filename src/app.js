const express = require('express');
const { userAuth } = require('./middlewares/auth');
// Creating a new express js application. This will create a new web server.
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(express.json()); // This will allow us to parse JSON data in the request body.
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

// Get feed api /feed -> get all the users from the database
app.get('/feed', (req, res) => {
    User.find({}).then((users) => {
        res.status(200).json(users);
    }).catch((err) => {
        res.status(500).send('Error fetching users');
    });
});

app.post('/login', async (req, res) => {
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
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        console.log("User details", req.user);
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).send(error.message ? error.message : 'Error fetching profile');
    }

});

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    // Sending a conenction request
    const user = req.user;

    console.log('Sending a connection request');
    res.send(user.firstName + " " + user.lastName + " is sending a connection request");
});

connectDb().then(() => {
    console.log('Connected to MongoDB');
    // 3000 refers to the port on which the application is running on.
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});