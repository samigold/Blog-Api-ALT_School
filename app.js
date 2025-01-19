const Database = require('./dbConnect');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {protect} = require('./middleware/validate');
const cookieparser = require('cookie-parser');

const PORT = process.env.PORT || 7500

// connect to database
Database.connect();

const app = express()

const mongoose = require('mongoose');
require('dotenv').config();

require("./controllers/authentication.controller");

const AuthenticationRoute = require("./routes/authentication.route")


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



app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(PORT, () => {
    console.log('Listening on port, ', PORT)
})