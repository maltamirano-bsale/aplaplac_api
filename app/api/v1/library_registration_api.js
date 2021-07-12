const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../config/database');

//Insertar una solicitud de libro
router.post('/library_registration', (req, res) =>{
    try {   
        let query = '';

        const id_usuario = req.body['id_usuario'];
        const id_solicitud_libro = 1;

        query = `SELECT * FROM registro_biblioteca WHERE ID_USUARIO = ${id_usuario}`;

        mysqlConnection.query(query,(err, rows) =>{
            if(!err){
                if(rows.length > 0){   
                    res.json({'code': 200, 'success':false, 'message':'usuario ya cuenta con registro de biblioteca'});
                }
                else{   
                    query = `SELECT * FROM alumno WHERE ID_USUARIO = ${id_usuario}`;
                    mysqlConnection.query(query,(err, rows) =>{
                        if(!err){
                            let id_alumno = 0;

                            if(rows.length > 0){
                                id_alumno = rows[0]['ID_ALUMNO']
                            }
                            
                            query = `INSERT INTO registro_biblioteca (ID_SOLICITUD_LIBRO, ID_USUARIO, ID_ALUMNO)
                                        VALUES (${id_solicitud_libro},${id_usuario},${id_alumno})`;

                            mysqlConnection.query(query,(err, rows) =>{
                                if(!err){
                                    if(rows.affectedRows > 0){
                                        res.json({'code': 200, 'success':true, 'message':'ok'});
                                    } 
                                    else{
                                        res.json({'code': 400, 'success':false, 'message':'no fue posible registrarse'});
                                    } 
                                }
                            })

                        }
                        else{
                            res.json({'code': 400, 'error':err});
                        }     
                    })        
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
