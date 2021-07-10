const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../config/database');

//Definicion de rutas
router.get('/book_request', (req, res) =>{
    try {   
        let params = '';
        let query = '';

        /*if(req.query['id']){
            params += `AND ID_SOLICITUD_LIBRO = ${req.query['id']}`
        }*/

        if(req.query['id_alumno']){
            params += ` AND slib.ID_ALUMNO = ${req.query['id_alumno']}`
        }

        query = `SELECT lib.NOMBRE_LIBRO,
                        lib.ID_LIBRO,
                        lib.IMAGEN,
                        es.DESCRIPCION,
                        slib.ESTADO_DE_SOLICITUD,
                        slib.FECHA_DE_SOLICITUD,
                        slib.FECHA_DE_ENTREGA,
                        slib.FECHA_DE_DEVOLUCION
                FROM solicitud_libro as slib
                INNER JOIN libro as lib ON lib.ID_LIBRO = slib.ID_SOLICITUD_LIBRO
                INNER JOIN estado_solicitud as es ON es.ID_ESTADO_SOLICITUD = slib.ESTADO_DE_SOLICITUD
                WHERE 1
                ${params}`

        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
                res.json({'code': 200, 'count':rows.length, 'data': rows});
            }
            else{
                res.json({'code': 400, 'error':err});
            }          
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/book_request/count', (req, res) =>{
    try {   
        let params = '';
        let query = '';

        if(req.query['id_alumno']){
            params += ` AND slib.ID_ALUMNO = ${req.query['id_alumno']}`
        }

        query = `SELECT es.DESCRIPCION as ESTADO, count(*) as CANTIDAD 
                FROM aplaplac.solicitud_libro sl
                JOIN aplaplac.estado_solicitud as es ON es.ID_ESTADO_SOLICITUD = sl.ESTADO_DE_SOLICITUD
                GROUP BY ESTADO_DE_SOLICITUD
                ${params}`;

        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
                console.log(rows);
                res.json({'code': 200, 'count':rows.length, 'data': rows});
            }
            else{
                res.json({'code': 400, 'error':err});
            }          
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/book_request', (req, res) =>{
    try {   
        let query = '';
        console.log(req.body);

        const id_libro = req.body['id_libro'];
        const id_alumno = req.body['id_alumno'];
        const estado = 1;

        query = `INSERT INTO solicitud_libro (ID_LIBRO, ID_ALUMNO, ESTADO_DE_SOLICITUD)
                 VALUES (${id_libro},${id_alumno},${estado})`;

        mysqlConnection.query(query,(err, rows) =>{
            if(!err){
                res.json({'code': 200, 'message':'ok'});
            }
            else{
                res.json({'code': 400, 'error':err});
            }          
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/book_request/valid/:id_usuario', (req, res) =>{
    try {   
        let query = '';

        id_usuario = req.params['id_usuario'];

        query =`SELECT tu.T_OCUPACION
                FROM usuario AS us
                JOIN tipo_usuario AS tu ON tu.ID_TIPO_USUARIO = us.ID_TIPO_USUARIO
                WHERE us.ID_USUARIO = ${id_usuario}`;

        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
                console.log(rows);
                if(rows.length > 0 ){
                    if(rows[0]['T_OCUPACION'] == 'ALUMNO'){

                        query =`SELECT al.ID_ALUMNO, al.ID_ESTADO_MATRICULA
                                FROM registro_biblioteca AS rb
                                JOIN alumno as al ON al.ID_USUARIO = rb.ID_USUARIO
                                WHERE rb.ID_USUARIO = ${id_usuario}`
    
                        mysqlConnection.query(query, (err, rows) =>{
                            if(!err){
    
                                if(rows[0]['ID_ESTADO_MATRICULA'] == 1){
                                    res.json({'code': 200, 'alumno_validado': true});
                                }
                                else{
                                    res.json({'code': 200, 'alumno_validado': false});
                                }
                            }
                        });
                    }
                    else{
                        query =`SELECT *
                                FROM registro_biblioteca AS rb
                                WHERE rb.ID_USUARIO = ${id_usuario}`
    
                        mysqlConnection.query(query, (err, rows) =>{
                            if(!err){
    
                                if(rows.length > 0){
                                    res.json({'code': 200, 'usuario_validado': true});
                                }
                                else{
                                    res.json({'code': 200, 'usuario_validado': false});
                                }
                                            
                            }
                        });
                    } 
                }
                else{
                    res.json({'code': 400, 'error':'Usuario no encontrado'});
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