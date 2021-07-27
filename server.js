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
        connection.query('SELECT * FROM user1  WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
     if(results.length > 0){ 
         req.session.loggeedin = true;
         req.session.userId = userId;
         client.linkRichMenuToUser(userId, "richmenu-43e2a9907623fc39dc87979fe782e926");
         console.log('รหัสถูกต้อง')
         res.end();
     } else if (username && password) {
         //menut
        connection.query('SELECT * FROM user2 WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
            if(results.length > 0){ 
                req.session.loggeedin = true;
                req.session.userId = userId;
                client.linkRichMenuToUser(userId, "richmenu-6e33f3d09eab4496a45841c363d1e565");
          
                console.log('รหัสถูกต้อง1')
                res.end();
               
            } else if (username && password) {
                // menue
                connection.query('SELECT * FROM user3 WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
                    if(results.length > 0){ 
                        req.session.loggeedin = true;
                        req.session.userId = userId;
                        client.linkRichMenuToUser(userId, "richmenu-cb6000bd15f994ea84fe36952503ca16");
                  
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