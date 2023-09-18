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


const notice = (request, response) => {

    const sql = `SELECT * FROM notice order by id DESC;`;
    
    conn.query(sql, (error,result,field)=>{
        if(error){
            // console.log("데이터베이스 접근에서 에러!!");
            response.send(error.message);
            return console.log(error);
        }else{
            // console.log("결과비교하는중");
            if(!result.length){
                // console.log(result);
                // console.log("result length = ", result.length);
                // console.log("아이디 검색해봤는데 결과가 없어!!");
                response.send("false");
                // response.send(result);
            }else{
                response.send(result);
                console.log(result);
            }
        }
    });
}

const news = (request, response) => {

    const sql = `SELECT * FROM news order by id DESC;`;
    
    conn.query(sql, (error,result,field)=>{
        if(error){
            // console.log("데이터베이스 접근에서 에러!!");
            response.send(error.message);
            return console.log(error);
        }else{
            // console.log("결과비교하는중");
            if(!result.length){
                // console.log(result);
                // console.log("result length = ", result.length);
                // console.log("아이디 검색해봤는데 결과가 없어!!");
                response.send("false");
                // response.send(result);
            }else{
                response.send(result);
                console.log(result);
            }
        }
    });
}


const addNotice = (request, response) => {


    console.log("result : ", request.body.title);

    const sql = `INSERT INTO
                    notice(
                        title,
                        content,
                        attached)
                    VALUES(
                        '${request.body.title}',
                        '${request.body.content}',
                        '${request.body.attached}'
                        );`;
            
    conn.query(sql, (error,result,field)=>{
        if(error){
            console.log(error);
            response.send(error.sqlState);
                    
        }else{
            response.send("true");
        }
    })
}

const addNews = (request, response) => {


    console.log("result : ", request.body.title);

    const sql = `INSERT INTO
                    news(
                        title,
                        content,
                        attached)
                    VALUES(
                        '${request.body.title}',
                        '${request.body.content}',
                        '${request.body.attached}'
                        );`;
            
    conn.query(sql, (error,result,field)=>{
        if(error){
            console.log(error);
            response.send(error.sqlState);
                    
        }else{
            response.send("true");
        }
    })
}

const deleteNotice = (request, response) => {

    const sql = `DELETE FROM notice WHERE id = '${request.body.id}';`;
            
    conn.query(sql, (error,result,field)=>{
        if(error){
            console.log(error);
            response.send(error.sqlState);
                    
        }else{
            response.send("true");
        }
    })
}

const deleteNews = (request, response) => {

    const sql = `DELETE FROM news WHERE id = '${request.body.id}';`;        

    conn.query(sql, (error,result,field)=>{
        if(error){
            console.log(error);
            response.send(error.sqlState);
                    
        }else{
            response.send("true");
        }
    })
}

const updateNotice = (request, response) => {

    const sql = `UPDATE notice SET title = '${request.body.title}', content = '${request.body.content}' WHERE id = '${request.body.id}';`;

    conn.query(sql, (error,result,field)=>{
        if(error){
            console.log(error);
            response.send(error.sqlState);
                    
        }else{
            response.send("true");
        }
    })
}

const updateNews = (request, response) => {

    const sql = `UPDATE news SET title = '${request.body.title}', content = '${request.body.content}' WHERE id = '${request.body.id}';`;

    conn.query(sql, (error,result,field)=>{
        if(error){
            console.log(error);
            response.send(error.sqlState);
                    
        }else{
            response.send("true");
        }
    })
}

const reloadNotice = (request, response) => {

    const sql = `SELECT * FROM notice WHERE id = '${request.body.id}'`;
    
    conn.query(sql, (error,result,field)=>{
        if(error){
            // console.log("데이터베이스 접근에서 에러!!");
            response.send(error.message);
            return console.log(error);
        }else{
            // console.log("결과비교하는중");
            if(!result.length){
                // console.log(result);
                // console.log("result length = ", result.length);
                // console.log("아이디 검색해봤는데 결과가 없어!!");
                response.send("false");
                
                // response.send(result);
            }else{
                response.send(result);
                console.log(result);
            }
        }
    });
}

const reloadNews = (request, response) => {

    const sql = `SELECT * FROM news WHERE id = '${request.body.id}'`;
    
    conn.query(sql, (error,result,field)=>{
        if(error){
            // console.log("데이터베이스 접근에서 에러!!");
            response.send(error.message);
            return console.log(error);
        }else{
            // console.log("결과비교하는중");
            if(!result.length){
                // console.log(result);
                // console.log("result length = ", result.length);
                // console.log("아이디 검색해봤는데 결과가 없어!!");
                response.send("false");
                // response.send(result);
            }else{
                response.send(result);
                console.log(result);
            }
        }
    });
}

module.exports = {
    notice,
    news,
    addNotice,
    addNews,
    deleteNotice,
    deleteNews,
    updateNotice,
    updateNews,
    reloadNotice,
    reloadNews
}