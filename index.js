const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    res.redirect('/users/login');
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    res.send('Logged In (this is a placeholder response)');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
