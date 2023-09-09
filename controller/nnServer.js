const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
dotenv.config();

app.use(cors({
    origin: true,//'http://localhost:3000',
    methods:['GET', 'POST'],
    credentials : true
}));

const conn = mysql.createConnection({
    host : process.env.DB_URL,
    user : process.env.DB_ID,
    password : process.env.DB_PW,
    database : process.env.DB_NAME
});

const addNotice = (request, response) => {


    console.log(request.body.title);

    const sql = `INSERT INTO 
                    notice(
                        title,
                        content,
                        attached
                    VALUES(
                        '${request.body.title}',
                        '${request.body.content}',
                        '${request.body.attached}'
                        );`;
            
    conn.query(sql, (error,result,field)=>{
        if(error){
            console.log(error.sqlState);
            response.send(error.sqlState);
                    
        }else{
            response.send("true");
        }
    })
}

module.exports = {
    addNotice
}