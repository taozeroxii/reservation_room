const express = require("express");
const server = express();
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const { check, validationResult } = require('express-validator');
const PORT = 3000;
const connect = require('./configs/database');
const routes = require('./routes');

//ตั้งค่า session สำหรับระบบ
server.use(expressSession({
    secret: 'thisistestweb',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

// `ตั้งค่าการ parse ตัวแปรเมื่อ client request หรือส่งข้อมูลเข้ามา
server.use(bodyParser.urlencoded({ extended: false,limit:'500MB' }));
server.use(bodyParser.json({limit:'500MB'}));

//allow content ให้พาร์ทรูปภาพสามารถมองเห็นได้ทั้งหมด
//server.use(express.static(__dirname));
server.use('/api/uploads' , express.static(`${__dirname}/uploads/equipments`));
server.use('/api/uploads' , express.static(`${__dirname}/uploads/rooms`));

//เรียกfunctioncomponent
server.use(require('./configs/middleware'));

//เรียกใช้งาน routes
server.use('/api',routes);
server.get('*', (req, res) => {
    res.end(`<h1>session is ${req.session.item}</h1>`);
})
server.listen(PORT, () => console.log(`sever started port: ${PORT} . `));
