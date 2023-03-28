const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 8000
const db = require('./config/mongoose')
const passport = require('passport')
const app = express();

// app.use(express.urlencoded({extended:true}));
app.use(bodyParser());
app.use(cors())

app.use(express.json())

//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running at port: ${port}`);
});