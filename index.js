require("./utils");
require("dotenv").config();

const express = require('express');
const bcrypt = require("bcrypt");
const saltRounds = 12;


const db_utils = include("database/db_utils");
const success = db_utils.printMySQLVersion();


const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    res.send('Logged In (this is a placeholder response)');
});


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    res.redirect('/users/login');
});

app.post('/createUser', async (req,res)=> { // Post Signup

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
  
    var hashedPassword = bcrypt.hashSync(password, saltRounds);
  
    if (email && password && username) {
        var success = await db_query.createUser({ username: username, email: email, hashed_pass: hashedPassword });
  
        if (success) {
            res.redirect("/"); // User successfully created
        }
        else {
            var createMsg = "Account already exists";
            res.redirect(`/signup?createMsg=${createMsg}`)
        }
  
    } else {
        if(!username) {
            var userMsg = "Please enter a username.";
        }
        if (!password) {
            var passMsg = "Please enter a password.";
        }
        if (!email) {
            var emailMsg = "Please enter an email.";
        }
        res.redirect(`/signup?userMsg=${userMsg}&emailMsg=${emailMsg}&passMsg=${passMsg}`)
    }
  });
  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
