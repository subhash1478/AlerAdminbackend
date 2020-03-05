'use strict';
var express = require('express');
var router = express.Router();
var ethnicServices = require('../services/ethnicServices');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.post('/add-edit-ethnic',   (req, res)=> {
    ethnicServices.addEditEthnic(req.body, (data) => {
        res.send(data);
    })
});
router.post('/delete-ethnic',   (req, res)=> {
    ethnicServices.deleteEthnic(req.body, (data) => {
        res.send(data);
    })
});
module.exports = router;