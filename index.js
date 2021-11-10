const exphbs  = require('express-handlebars');
const express = require("express")
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(request, response) {
	response.render("index")
});

const port = process.env.PORT||3000 
app.listen(port,function(){
    console.log('App running')
})

