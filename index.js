const exphbs = require('express-handlebars');
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/', function (request, response) {
    response.render("index");
});

app.get('/home', function (req, res) {
    // render the home views
    res.render('home');
});

app.post('/login', function (req, res) {
    // do something with the data like saving it to  database
    res.redirect('/home');
});

app.get('/app/function', function (req, res) {
    res.render('indexui');
});

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('App running')
});

