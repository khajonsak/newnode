require('dotenv').config();

const express = require('express');
var session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const logger = require('morgan');
const line = require('@line/bot-sdk');
const cors = require('cors');
const mysql = require('mysql');
const PORT = process.env.PORT || 8080;



const connection = mysql.createConnection({
    host: 'mysql-khajonsak.alwaysdata.net',
    user: 'khajonsak',
    password: '08052543pok',
    database: 'khajonsak_01'

});


const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};


const client = new line.Client(config);
const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors());

app.get("/", (req, res)=>{
    res.send("API");
})
//U2db00ef1712aa45bf9fcca64c3c82501
app.get('/logout', (req, res) => {    
    client.unlinkRichMenuFromUser("U2db00ef1712aa45bf9fcca64c3c82501");
    res.json({
        data: req.body
    });
});

app.post('/loginrich', (req, res) => {
    //menus
    const { username, password, userId } = req.body;
    console.log(req.body);
    if (username && password){
        connection.query('SELECT * FROM userstudent  WHERE id = ? AND password = ?', [username, password], function(error, results, fields){
     if(results.length > 0){ 
         req.session.loggeedin = true;
         req.session.userId = userId;
         client.linkRichMenuToUser(userId, "richmenu-c389d9f81d83185adfa30f1c3525271d");
         console.log('รหัสถูกต้อง')
         res.end();
     } else if (username && password) {
         //menut
        connection.query('SELECT * FROM usertelogin WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
            if(results.length > 0){ 
                req.session.loggeedin = true;
                req.session.userId = userId;
                client.linkRichMenuToUser(userId, "richmenu-fca7365edeb5aa73cbbf55f3554d819e");
          
                console.log('รหัสถูกต้อง1')
                res.end();
               
            } else if (username && password) {
                // menue
                connection.query('SELECT * FROM useragencylogin WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
                    if(results.length > 0){ 
                        req.session.loggeedin = true;
                        req.session.userId = userId;
                        client.linkRichMenuToUser(userId, "richmenu-6c023ea73b040ac487213028cdde33a1");
                  
                        console.log('รหัสถูกต้อง2')
                        res.end();
                    } else {
                        res.end();
                    }

                })
            }
        })
        
     } 
     
 });

 }
   
})

app.listen(PORT, ()=>{
    console.log(`Serer is running. ${PORT}`)
})