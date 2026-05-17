const express = require('express');
// Creating a new express js application. This will create a new web server.
const app = express();

// app.use("/test", (req, res) => {
//     res.send("Hello World from server");
// })

// app.use("/hello", (req, res) => {
//     res.send("Hello Hello Hello");
// })



app.get('/user', (req, res) => {
    res.send({ firstName: "Devi", lastName: "Desai" });
})

app.post('/user', (req, res) => {
    console.log("This is a post request");
    res.send("Data successfully saved in the database!!");
})

app.delete('/user', (req, res) => {
    console.log("This is a delete request");
    res.send("Data successfully deleted from the database!!");
})

app.use("/user", (req, res) => {
    res.send("Namaste Devi Desai!!");
})
// 3000 refers to the port on which the application is running on.
app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});