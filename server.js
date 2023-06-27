const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const jwt = require('jsonwebtoken');
const cors = require('cors');
const parser = require('xml2js');
const path = require('path');
const cookieParser = require('cookie-parser');
const controller = express.Router();
const {
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout
} = require('./controller/index.js');

// const {testFunction} = require('./controller');

// const { access } = require('fs');

dotenv.config();

const app = express();

const conn = mysql.createConnection({
    host : process.env.DB_URL,
    user : process.env.DB_ID,
    password : process.env.DB_PW,
    database : process.env.DB_NAME
});


app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(cors({
    origin:'http://localhost:3000',
    methods:['GET', 'POST'],
    credentials : true
}));

app.use(express.json());
app.use(cookieParser());
conn.connect();

app.listen(process.env.PORT, (error, result, field)=>{
    if(error) console.log(error)
    else{
        //console.log(parser);
        console.log(`Listen on port : ${process.env.PORT}`);
        console.log(`DB_URL : ${process.env.DB_URL}`);
        console.log(`DB_NAME : ${process.env.DB_NAME}`);
        console.log(`result : ${field}`);
    }
});

app.get('/', (request, response)=>{
    response.send("hello");
});


app.get('/aboutus', (request, response)=>{
    response.send("about our page\n");
});

app.get('/home', (request, response)=>{
    response.send("home page\n");
});

app.get('/shop', (request, response)=>{
    response.send("shop page\n");
});

app.post('/login', login);
    // res.send(req.body.ID);
    // console.log(request.body.ID);
    // console.log(request.body.PW);

    // const SaltRounds = 10;
    // bcrypt.hash(request.body.PW, SaltRounds, function(err, hash){
    //     console.log(hash);
    // });

    // var sql = 'SELECT * FROM user WHERE ID = `${request.body.ID}`;'
    


app.get('/accesstoken', accessToken);
app.get('/refreshtoken', refreshToken);
app.get('/login/sucess', loginSuccess);
app.post('/logout', logout);
