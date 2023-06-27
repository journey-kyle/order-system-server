const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
dotenv.config();

app.use(cors());

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
                    
                        if(confirm){

                            try{
                                const accessToken = jwt.sign({
                                    id : result[0].id,
                                    username : result[0].username,
                                    email : result[0].email,
                                    // branch : result[0].branch,
                                    // level:result[0].level
                                }, process.env.ACCESS_SECRET,{
                                    expiresIn : '1h',
                                    issuer : 'keycoffee'
                                });

                                const refreshToken = jwt.sign({
                                    id : result[0].id,
                                    username : result[0].username,
                                    email : result[0].email,
                                    // branch : result[0].branch,
                                    // level:result[0].level
                                }, process.env.REFRESH_SECRET,{
                                    expiresIn : '1d',
                                    issuer : 'keycoffee'
                                });

                                response.cookie("accessToken", accessToken, {
                                    secure : false,
                                    httpOnly : true
                                });

                                response.cookie("refreshToken", refreshToken, {
                                    secure : false,
                                    httpOnly : true
                                });

                                response.send(confirm);

                            } catch(error){
                                response.status(500).json(error);
                            }
                        }else {
                            response.send(confirm);
                        }

                        console.log("ID : ",request.body.ID);
                        console.log("지점 : ", row.branch);
                        console.log("login : ", confirm);
                        console.log("date : ",new Date().toLocaleString('ko-KR', ""));


                    }); 
                });
                // console.log(result[0].password);
            };
        };
    });
}

const accessToken = (request, response) => {
    try{
        const token = request.cookie.accessToken;
        const data = jwt.verify(token, process.env.ACCESS_SECRET);

        

    }catch(error){

    }
}

const refreshToken = (request, response) => {
    response.send("rftk");
}

const loginSuccess = (request, response) => {
    response.send("lgsc");
}

const logout = (request, response) => {
    try{
        request.cookie('accessToken', '');
        response.send("Log out Success");
    }catch(error){

    }
}

module.exports = {
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout
}