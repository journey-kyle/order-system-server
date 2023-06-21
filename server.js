require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const conn = mysql.createConnection({
    host : process.env.DB_URL,
    user : process.env.DB_ID,
    password : process.env.DB_PW,
    database : process.env.DB_NAME
});

conn.connect();


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
        //console.log(parser);
        console.log("Listen on port : " + process.env.PORT);
        console.log("DB_URL : " + process.env.DB_URL);
        console.log("DB_NAME : " + process.env.DB_NAME);
        console.log('result : ' + field);
    }
});

app.get('/', function(request, response){
    response.send("hello");
});


app.get('/aboutus', function(request, response){
    response.send("about our page\n");
});

app.get('/home', function(request, response){
    response.send("home page\n");
});

app.get('/shop', function(request, response){
    response.send("shop page\n");
});

app.post('/server/login', function(request,response){
    // res.send(req.body.ID);
    console.log(request.body.ID);
    console.log("저기요");
    // var sql = 'SELECT * FROM user WHERE ID = `${request.body.ID}`;'
    var sql = `SELECT * FROM user WHERE "열1" = '${request.body.ID}';`
    console.log(sql);

    conn.query(sql, function(error,result,field){
        if(error){
            console.log("엥?");
            response.send(error.message);
            return console.log(error);
        }else{
            if(!result.length){
                response.send(result);
            };
        };
    });
});