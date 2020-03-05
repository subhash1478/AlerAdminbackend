'use strict';
var express = require('express');
var router = express.Router();
var specialCategoriesServices = require('../services/specialCategoriesServices');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/',   (req, res)=> {
    specialCategoriesServices.getSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/add-edit',   (req, res)=> {
    specialCategoriesServices.addEditSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/delete',   (req, res)=> {
    specialCategoriesServices.deleteSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
module.exports = router;