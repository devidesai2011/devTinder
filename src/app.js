const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');
// Creating a new express js application. This will create a new web server.
const app = express();

app.use('/admin', adminAuth);

app.use('/user', userAuth);

app.get('/admin/getAllData', (req, res) => {
    res.send("All data sent");
});

app.get('/admin/deleteUser', (req, res) => {
    res.send("User deleted");
});

app.get('/user/getUserData', (req, res) => {
    res.send("User data sent");
});

// 3000 refers to the port on which the application is running on.
app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});