const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../config/database');

//Definicion de rutas

//Consultar Estado de Arancel Por Alumno
router.get('/tariffs_arancel/:id', (req, res) =>{
    try {   

        const id = req.params['id'];

        let query = `SELECT 
        concat(u.NOMBRE, ' ', u.APELLIDO_PATERNO) AS nombre_completo,
        pa.FECHA_DE_PAGO AS 'fecha pago',
        pa.MONTO_DE_PAGO AS monto,
        ea.DESCRIPCION AS estado
        FROM alumno a 
        JOIN usuario u ON a.ID_ALUMNO = u.ID_USUARIO
        JOIN pago_arancel pa ON pa.ID_ALUMNO = a.ID_ALUMNO
        JOIN estado_arancel ea ON ea.ID_ESTADO_ARANCEL = a.ID_ESTADO_ARANCEL
        WHERE a.ID_ALUMNO = ${id}`;
        console.log(query);


        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
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

//Consultar Estado de Matricula Por Alumno
router.get('/tariffs_matricula/:id', (req, res) =>{
    try {   

        const id = req.params['id'];

        let query = `SELECT 
        concat(u.NOMBRE, ' ', u.APELLIDO_PATERNO) AS nombre_completo,
        pm.FECHA_DE_PAGO AS 'fecha pago',
        pm.MONTO_DE_PAGO AS monto,
        em.DESCRIPCION AS estado
        FROM alumno a 
        JOIN usuario u ON a.ID_ALUMNO = u.ID_USUARIO
        JOIN pago_matricula pm ON pm.ID_ALUMNO = a.ID_ALUMNO
        JOIN estado_matricula em ON em.ID_ESTADO_MATRICULA = a.ID_ESTADO_MATRICULA 
        WHERE a.ID_ALUMNO = ${id}`;
        console.log(query);


        mysqlConnection.query(query, (err, rows) =>{
            if(!err){
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


module.exports = router;