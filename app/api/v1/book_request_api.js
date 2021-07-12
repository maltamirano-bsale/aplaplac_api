const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../config/database');

//Definicion de rutas

router.get('/book_request', (req, res) =>{
    try {   
        let query = '';
        let params = '';

        if(req.query['rut']){
            console.log(req.query['rut']);
            params += ` AND us.RUT = '${req.query['rut']}'`
        }

        query = `SELECT sl.ID_SOLICITUD_LIBRO,
                        us.RUT, us.NOMBRE, 
                        us.APELLIDO_PATERNO, 
                        us.APELLIDO_MATERNO, 
                        lib.NOMBRE_LIBRO,
                        es.DESCRIPCION
                FROM solicitud_libro AS sl
                JOIN usuario AS us ON US.ID_USUARIO = sl.ID_USUARIO
                JOIN libro AS lib ON lib.ID_LIBRO = sl.ID_LIBRO
                JOIN estado_solicitud AS es ON es.ID_ESTADO_SOLICITUD = sl.ESTADO_DE_SOLICITUD
                WHERE 1
                ${params}
                ORDER BY sl.FECHA_DE_SOLICITUD desc`;

        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
                console.log(rows);
                res.json({'code': 200, 'data': rows});
            }
            else{
                res.json({'code': 400, 'error':err});
            }          
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/book_request/:id_usuario', (req, res) =>{
    try {   
        const { id_usuario } = req.params;
        let query = '';

        query = `SELECT lib.NOMBRE_LIBRO,
                        lib.ID_LIBRO,
                        lib.IMAGEN,
                        es.DESCRIPCION,
                        slib.ESTADO_DE_SOLICITUD,
                        slib.FECHA_DE_SOLICITUD,
                        slib.FECHA_DE_ENTREGA,
                        slib.FECHA_DE_DEVOLUCION
                FROM solicitud_libro as slib
                INNER JOIN libro as lib ON lib.ID_LIBRO = slib.ID_LIBRO
                INNER JOIN estado_solicitud as es ON es.ID_ESTADO_SOLICITUD = slib.ESTADO_DE_SOLICITUD
                WHERE slib.ID_USUARIO = ${id_usuario}`;

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

router.get('/book_request/count/:id_usuario', (req, res) =>{
    try {   
        const { id_usuario } = req.params;
        let query = '';

        /*if(req.query['id_alumno']){
            params += ` AND slib.ID_ALUMNO = ${req.query['id_alumno']}`
        }*/

        query = `SELECT es.DESCRIPCION as ESTADO, count(*) as CANTIDAD 
                FROM maltamirano.solicitud_libro as sl
                JOIN maltamirano.estado_solicitud as es ON es.ID_ESTADO_SOLICITUD = sl.ESTADO_DE_SOLICITUD
                WHERE ID_USUARIO = ${id_usuario}
                GROUP BY ESTADO_DE_SOLICITUD`;

        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
                console.log("DATA");
                console.log(rows);
                if(rows.length > 0){
                    res.json({'code': 200, 'count':rows.length, 'data': rows});
                }
                else{
                    res.json({'code': 400, 'count':rows.length});
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

//Insertar una solicitud de libro
router.post('/book_request', (req, res) =>{
    try {   
        let query = '';
        console.log(req.body);

        const id_libro = req.body['id_libro'];
        const id_usuario = req.body['id_usuario'];
        const estado = 1;

        query = `INSERT INTO solicitud_libro (ID_LIBRO, ESTADO_DE_SOLICITUD, ID_USUARIO)
                 VALUES (${id_libro},${estado},${id_usuario})`;

        mysqlConnection.query(query,(err, rows) =>{
            if(!err){
                console.log("ROWS");
                if(rows.affectedRows > 0){
                    res.json({'code': 200, 'success':true, 'message':'ok'});
                } 
                else{
                    res.json({'code': 400, 'success':false, 'message':'no fue posible solicitar el libro'});
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

//Insertar una solicitud de libro
router.put('/book_request/:id_solicitud', (req, res) =>{
    try {   
        let query = '';
        const id_solicitud = req.params['id_solicitud'];
        const estado = req.body['estado_solicitud'];

        query = `UPDATE maltamirano.solicitud_libro SET
                        ESTADO_DE_SOLICITUD = ${estado}
                 WHERE ID_SOLICITUD_LIBRO = ${id_solicitud}`;

        mysqlConnection.query(query,(err, rows) =>{
            if(!err){
                console.log("ROWS");
                if(rows.affectedRows > 0){
                    res.json({'code': 200, 'success':true, 'message':'ok'});
                } 
                else{
                    res.json({'code': 400, 'success':false, 'message':'no fue posible solicitar el libro'});
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


//validacion de usuarios para solicitar libros
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
                                if(rows.length > 0){
                                    console.log("ES ALUMNO");
                                    console.log(rows);
                                    if(rows[0]['ID_ESTADO_MATRICULA'] == 1){
                                        res.json({'code': 200, 'usuario_validado': true});
                                    }
                                    else{
                                        res.json({'code': 200, 'usuario_validado': false, 'msg':'falta matricula'});
                                    }
                                }
                                else{
                                    res.json({'code': 200, 'usuario_validado': false, 'msg':'falta registro biblioteca'})
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
                                console.log("SI NO ES ALUMNO");
                                console.log(rows);
                                if(rows.length > 0){
                                    res.json({'code': 200, 'usuario_validado': true});
                                }
                                else{
                                    res.json({'code': 200, 'usuario_validado': false, 'msg':'falta registro biblioteca'});
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