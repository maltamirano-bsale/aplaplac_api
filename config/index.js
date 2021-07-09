const express = require('express');
const app = express();
const cors = require('cors');
const sqlinjection = require('sql-injection');

//Cors
app.use(cors({origin: 'http://127.0.0.1:5500'}));

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());


//Routes
app.use(require('../app/api/v1/book_api'));
app.use(require('../app/api/v1/book_request_api'));
app.use(require('../app/api/v1/library_user'));

//Iniciacion del servidor
app.listen(app.get('port'), ()=>{
    console.log('Server on port ', app.get('port'));
});