//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});




const User = new mongoose.model("User", userSchema);

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        } else {
            res.render(err);
        }
    });
});

app.post("/login", function (req, res) {
    const userName = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: userName}, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        } else {
            console.log(err);
        }
    });
});


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});


app.listen(3000, function () {

    console.log("Successfully started server");
});