'use strict';
var express = require('express');
var router = express.Router();
var ethnicServices = require('../services/ethnicServices');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.post('/add',   (req, res)=> {
    ethnicServices.addEthnic(req.body, (data) => {
        res.send(data);
    })
});
module.exports = router;