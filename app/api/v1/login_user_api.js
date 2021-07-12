const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../config/database');

//Definicion de rutas
router.get('/valid_user/:email/:pass', (req, res) =>{
    try {   
        const email = req.params['email'].match(/^([^@]*)@/)[1];
        const pass = req.params['pass'];
        let query = `SELECT * FROM usuario WHERE CORREO_ELECTRONICO LIKE '%${email}%' AND CONTRASEÑA = '${pass}'`;
        console.log(query);

        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
                if(rows.length > 0){
                    res.json({'code': 200, 'status':true, 'data': rows});
                }
                else{
                    res.json({'code': 200, 'status':false, 'message': 'correo o contraseña incorrectos'})
                }      
            }
            else{
                res.json({'code': 400, 'error':err});
            }         
        });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;