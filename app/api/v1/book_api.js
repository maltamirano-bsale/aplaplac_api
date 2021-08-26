const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../config/database');

//test
//Definicion de rutas
router.get('/book', (req, res) =>{
    try {   
        let params = '';
        let query = '';

        if(req.query['id']){
            params += ` AND ID_LIBRO = ${req.query['id']}`
        }

        query = `SELECT * FROM libro WHERE 1 ${params}`

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

router.get('/book/:id', (req, res) =>{
    console.log(req.route);
    const { id } = req.params;
    try {   
    let query = 'SELECT * FROM libro WHERE ID_LIBRO = ?'

    mysqlConnection.query(query, [id], (err, rows) =>{
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