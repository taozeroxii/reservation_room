const mysql = require('mysql');

const connection  = mysql.createConnection({
  host            : 'localhost',
  user            : 'root',
  password        : '1234',
  database        : 'meeting_room_db',
  charset:'utf8'
});

//connection.getConnection((err,connect)=> console.log(err));//เช็ค connection 
module.exports = connection;