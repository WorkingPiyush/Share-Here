const dotenv = require('dotenv').config();
const mysql = require('mysql2');
// connecting the mySql dataBase
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
})
// checking wether it connects or not
db.connect((err) => {
    if (err) {
        console.log("New Error: ", err)
    } else {
        console.log("DataBase Connected !!")
    }
})

module.exports = db ;
