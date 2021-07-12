const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../config/database');

//Definicion de rutas
router.get('/user/:id_usuario', (req, res) =>{
    try {   
        const { id_usuario } = req.params;
        let query = '';

        query = `SELECT * FROM usuario WHERE ID_USUARIO = ${id_usuario}`

        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
                if(rows.length > 0 ){
                    res.json({'code': 200, 'success':true, 'data': rows});
                }
                else{
                    res.json({'code': 200, 'success':false, 'message': 'Usuario no encontrado'});
                }    
            }
            else{
                res.json({'code': 400, 'success':false, 'error':err});
            }          
        });
    } catch (error) {
        console.log(error)
    }
});



module.exports = router;