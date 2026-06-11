const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');
// Creating a new express js application. This will create a new web server.
const app = express();
const connectDb = require('./config/database');
const User = require('./models/user');

app.use(express.json()); // This will allow us to parse JSON data in the request body.

app.post('/signup', (req, res) => {
    // Creating a new instance  of user model
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send('User created successfully');
    }).catch((err) => {
        res.status(500).send(err.message ? err.message : 'Error creating user');
    });
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

connectDb().then(() => {
    console.log('Connected to MongoDB');
    // 3000 refers to the port on which the application is running on.
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});