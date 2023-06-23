const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const conn = mysql.createConnection({
    host : process.env.DB_URL,
    user : process.env.DB_ID,
    password : process.env.DB_PW,
    database : process.env.DB_NAME
});

const login = (request, response) => {

    var sql = `SELECT * FROM users WHERE username = '${request.body.ID}';`

    conn.query(sql, (error,result,field)=>{
        if(error){
            response.send(error.message);
            return console.log(error);
        }else{
            
            if(!result.length){
                // console.log(result);
                // console.log("result length = ", result.length);
                response.send("false");
                // response.send(result);
            }else{

                result.forEach((row)=>{
                    bcrypt.compare(request.body.PW, row.password, function(err, confirm){
                        console.log("ID : ",request.body.ID);
                        console.log("지점 : ", row.branch);
                        console.log("login : ", confirm);
                        console.log("date : ",new Date().toLocaleString('ko-KR', ""));
                        response.send(confirm);
                    }); 
                });
                console.log(result[0].password);
            };
        };
    });
}

const accessToken = (request, response) => {
    response.send("actk");
}

const refreshToken = (request, response) => {
    response.send("rftk");
}

const loginSuccess = (request, response) => {
    response.send("lgsc");
}

const logout = (request, response) => {
    response.send("lg");
}

function testfunction(req,res){
    console.log(req.body.ID);
    res.send("메롱");
}

module.exports = {
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout
}