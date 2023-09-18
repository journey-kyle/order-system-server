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

const login = (request, response) => {

    const sql = `SELECT * FROM users WHERE username = '${request.body.ID}';`

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
                // console.log("DB에 같은 아이디가 있어!!");
                result.forEach((row)=>{
                    bcrypt.compare(request.body.PW, row.password, function(err, confirm){
                        // console.log("비밀번호가 맞는지 확인해볼게");
                        if(confirm){
                            // console.log("비밀번호도 일치해!! JWT 만들자");
                            try{
                                const accessToken = jwt.sign({
                                    id : result[0].id,
                                    name : result[0].username,
                                    email : result[0].email,
                                    branch : result[0].branch,
                                    level:result[0].level
                                }, process.env.ACCESS_SECRET,{
                                    expiresIn : '10s',
                                    issuer : 'keycoffee'
                                });
                                // console.log("access token 만들었다.");
                                const refreshToken = jwt.sign({
                                    id : result[0].id,
                                    name : result[0].username,
                                    email : result[0].email,
                                    branch : result[0].branch,
                                    level:result[0].level
                                }, process.env.REFRESH_SECRET,{
                                    expiresIn : '6h',
                                    issuer : 'keycoffee'
                                });
                                // console.log("refresh token 만들었다.");
                                response.cookie("accessToken", accessToken, {
                                    secure : false,
                                    httpOnly : true
                                });
                                // console.log("access token 보냈다.");
                                response.cookie("refreshToken", refreshToken, {
                                    secure : false,
                                    httpOnly : true
                                });
                                // console.log("refresh token 보냈다.");

                                console.log("access token : ", accessToken, "\nrefresh token : ", refreshToken);

                                response.send(confirm);

                            } catch(error){
                                response.status(500).json(error);
                            }
                        }else {
                            // console.log("비밀번호가 일치하지 않아ㅠ");
                            response.send(confirm);
                        }
                        console.log("IP Address : ",request.headers.origin);
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
        const token = request.cookies.accessToken;
        const data = jwt.verify(token, process.env.ACCESS_SECRET);
        console.log(data);
        response.send(data);
        
    }catch(error){
        // refreshToken();
        // console.log("access error : ", error);
        if(error.name === "TokenExpiredError"){
            // response.send(refreshTK(request.cookies.refreshToken));
            try{
                
                const token = request.cookies.refreshToken;;
                const data = jwt.verify(token, process.env.REFRESH_SECRET);

                const accessToken = jwt.sign({
                    id : data.id,
                    name : data.name,
                    email : data.email,
                    branch : data.branch,
                    level: data.level
                }, process.env.ACCESS_SECRET,{
                    expiresIn : '10s',
                    issuer : 'keycoffee'
                });
                
                response.cookie("accessToken", accessToken, {
                    secure : false,
                    httpOnly : true
                });

                console.log("data : ",data);
                response.send(data);
        
            }catch(error){
                console.log(error);
                response.send(error);
            }
        }else{

            response.send(error);
            console.log(error.name)
        }
    }
}


const refreshToken = (request, response) => {
    // AccessToken 갱신
    try{
        
        const token = request.cokkies.refreshToken;
        const data = jwt.verify(token, process.env.REFRESH_SECRET);
        
        const accessToken = jwt.sign({
            id : data.id,
            name : data.username,
            email : data.email,
            branch : result[0].branch,
            // level:result[0].level
        }, process.env.ACCESS_SECRET,{
            expiresIn : '1m',
            issuer : 'keycoffee'
        });
        
        response.cookie("accessToken", accessToken, {
            secure : false,
            httpOnly : true
        });

        response.send(data);

    }catch(error){
        
        response.send(error);
    }
}

const loginSuccess = (request, response) => {
    response.send("lgsc");
}

const logout = (request, response) => {
    
    try{
        // console.log("refresh token 만들었다.");
        response.cookie("accessToken", "", {
            secure : false,
            httpOnly : true
        });
        // console.log("access token 보냈다.");
        response.cookie("refreshToken", "", {
            secure : false,
            httpOnly : true
        });

        response.send(false);
        
    }catch(error){
        response.send(error);
    }
}

const signup = (request, response) => {
    
    bcrypt.hash(request.body.pw, 10, (error,hash) => {
        if(error){
            console.error("hash error", error);
            return;
        }else{
            const sql = `INSERT INTO 
                    users(
                        username,
                        email,
                        password,
                        branch,
                        level) 
                    VALUES(
                        '${request.body.id}',
                        '${request.body.email}',
                        '${hash}',
                        '${request.body.branch}',
                        '${request.body.level}'
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
    });
}



module.exports = {
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout,
    signup
}