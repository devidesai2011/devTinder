const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');
// Creating a new express js application. This will create a new web server.
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');

app.use(express.json()); // This will allow us to parse JSON data in the request body.

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

// Get user by id
app.get('/user', (req, res) => {
    const id = req.body.id;
    User.findById(id).then((user) => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    }).catch((err) => {
        res.status(500).send(err.message ? err.message : 'Error fetching user');
    });
});

// Create a delete Api
app.delete('/user', (req, res) => {
    const id = req.body.id;
    User.findByIdAndDelete(id).then((user) => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    }).catch((err) => {
        res.status(500).send('Error deleting user');
    });
});

// Update data of the user
app.patch('/user/:id', (req, res) => {
    const id = req.params?.id;
    const updateData = req.body;
    const ALLOWED_UPDATES = ['age', 'gender', 'photoUrl', 'about', 'skills'];
    const isUpdateAllowed = Object.keys(updateData).every((key) => ALLOWED_UPDATES.includes(key));
    if (!isUpdateAllowed) {
        return res.status(400).send('Invalid updates');
    }
    if (updateData?.skills.length > 10) {
        return res.status(400).send('Too many skills');
    }
    User.findByIdAndUpdate(id, updateData, { runValidators: true }).then((user) => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    }).catch((err) => {
        res.status(500).send('Error updating user');
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send(error.message ? error.message : 'Error logging in');
    }
})

connectDb().then(() => {
    console.log('Connected to MongoDB');
    // 3000 refers to the port on which the application is running on.
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});