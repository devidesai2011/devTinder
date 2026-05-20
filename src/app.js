const express = require('express');
// Creating a new express js application. This will create a new web server.
const app = express();

// app.use("/test", (req, res) => {
//     res.send("Hello World from server");
// })

// app.use("/hello", (req, res) => {
//     res.send("Hello Hello Hello");
// })



app.get("/user",
    [(req, res, next) => {
        console.log("handling route user 1");
        next();
    },
    (req, res, next) => {
        console.log("handling route user 2");
        next();
    },
    (req, res, next) => {
        console.log("handling route user 3");
        next();
    }],
    (req, res, next) => {
        console.log("handling route user 4 ");
        next();
    },
    (req, res, next) => {
        console.log("handling route user 5 ");
        res.send("Route 5");
    });
// 3000 refers to the port on which the application is running on.
app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});