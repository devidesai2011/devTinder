const express = require('express');
// Creating a new express js application. This will create a new web server.
const app = express();
const connectDb = require('./config/database');

const cookieParser = require('cookie-parser');
app.use(express.json()); // This will allow us to parse JSON data in the request body.
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDb().then(() => {
    console.log('Connected to MongoDB');
    // 3000 refers to the port on which the application is running on.
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});