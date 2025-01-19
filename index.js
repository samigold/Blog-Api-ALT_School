const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {protect} = require('./middleware/validate');
const cookieparser = require('cookie-parser');

const mongoose = require('mongoose');
require('dotenv').config();

require("./controllers/authentication.controller");

const AuthenticationRoute = require("./routes/authentication.route")

const app = express()

const authorBlogRoute = require("./routes/authorblog.route");
const blogsRoute = require("./routes/blogs.route");

// const PORT = 7500;

app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/", AuthenticationRoute);
app.use("/authorblog", protect, authorBlogRoute);
app.use("/blog", blogsRoute);


app.get('/', (req, res) => {
    res.json({ status: true, i: "Key information about this API.",  ii: "use /blog to view all published blogs", iii: "Login or signup (using /login or /signup) to be able create and manage your blog as an author on /authorblog route."})
    const {secret_token} = req.cookies
    console.log(secret_token)
})

// mongoose.connect('mongodb://localhost:27017')

// mongoose.connection.on("connected", () => {
// 	console.log("Connected to MongoDB Successfully");
// });

// mongoose.connection.on("error", (err) => {
// 	console.log("An error occurred while connecting to MongoDB");
// 	console.log(err);
// });

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});


// app.listen(PORT, () => {
//     console.log('Listening on port, ', PORT)
// })

module.exports = app;