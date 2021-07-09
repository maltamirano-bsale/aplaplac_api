const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'aplaplac'
});

mysqlConnection.connect((err)=>{
    if(err){
        console.log("Error connecting to database: ", err);
    }
    else{
        console.log("Database connection successful");
    }
});

module.exports = mysqlConnection;