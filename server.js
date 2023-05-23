require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const conn = require('mysql2').createPool({
        host:process.env.DB_URL,
        user:process.env.DB_ID,
        password:process.env.DB_PW,
        database:process.env.DB_NAME
    }
)

app.use(express.json());

var cors = require('cors');
var parser = require('xml2js');
const path = require('path');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(cors());

app.listen(process.env.PORT, function(error, result, field){
    if(error) console.log(error)
    else{
        console.log(parser);
        console.log("Listen on port : " + process.env.PORT);
        console.log("DB_URL : " + process.env.DB_URL);
        console.log("DB_NAME : " + process.env.DB_NAME);
        console.log('result : ' + field);
    }
});

app.get('/', function(req, res){
    res.send("hello");
});


app.get('/about', function(req, res){
    res.send("about page\n");
});

