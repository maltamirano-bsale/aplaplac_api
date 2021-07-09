const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'hitcode.net',
    user: 'maltamirano',
    password: 'maltamirano2021',
    database: 'MALTAMIRANO'
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
