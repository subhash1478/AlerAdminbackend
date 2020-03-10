'use strict';
var express = require('express');
var router = express.Router();
var specialCategoriesServices = require('../services/specialCategoriesServices');
var isAuthorized = require('../services/authServices').verify;
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.get('/', isAuthorized, (req, res, next) => {
    specialCategoriesServices.getSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/add-edit', isAuthorized, (req, res, next) => {
    specialCategoriesServices.addEditSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/delete', isAuthorized, (req, res, next) => {
    specialCategoriesServices.deleteSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.get('/master-product-allergen-alias', isAuthorized, (req, res, next) => {
    specialCategoriesServices.getMasterProductAllergenAlias(req.query, (data) => {
        res.send(data);
    })
});
router.post('/map-product-allergen-alias-special-categories', isAuthorized, (req, res, next) => {
    specialCategoriesServices.mapProductAllergenAliasSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
module.exports = router;