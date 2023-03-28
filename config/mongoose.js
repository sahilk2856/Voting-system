const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to monggoDB'));

db.once('open', function(){
    console.log('connected to Database :: MongoDB');
})

module.exports = db;