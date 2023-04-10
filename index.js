const express = require('express')
const cors = require('cors')
const port = process.env.PORT||8000
const db = require('./config/mongoose')
const app = express();
const errorHandler=require('./middleware/error');

app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json())

//use express router
app.use('/', (req,res,next)=>{
    // console.log("here outside",res.methods)
    if(req.methods == 'OPTIONS'){
        // console.log("here")
        return res.json({message:"success"})
    }
    next()

})
app.use('/',require('./routes'));
app.use(errorHandler);

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running at port: ${port}`);
});