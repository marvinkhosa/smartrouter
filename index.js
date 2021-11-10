const express = require("express")
const app = express()



app.get('/', function(request, response) {
	response.send("fleet")
});

const port = process.env.PORT||3000 
app.listen(port,function(){
    console.log('App running')
})