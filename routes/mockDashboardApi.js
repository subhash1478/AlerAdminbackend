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
router.get('/',  (req, res, next) => {
    specialCategoriesServices.getSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/add-edit',  (req, res, next) => {
    specialCategoriesServices.addEditSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/delete',   (req, res, next) => {
    specialCategoriesServices.deleteSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/master-product-allergen-alias',   (req, res, next) => {
    specialCategoriesServices.getMasterProductAllergenAlias(req.body, (data) => {
        res.send(data);
    })
});
router.post('/map-product-allergen-alias-special-categories',  (req, res, next) => {
    specialCategoriesServices.mapProductAllergenAliasSpecialCategories(req.body, (data) => {
        res.send(data);
    })
});
router.post('/get-instore-product-category',   (req, res, next) => {
    specialCategoriesServices.getProductCategoryProductsinStore(req.body, (data) => {
        res.send(data);
    })
});
router.post('/get-instore-product-sub-category',   (req, res, next) => {
    specialCategoriesServices.getProductSubCategoryProductsinStore(req.body, (data) => {
        res.send(data);
    })
});
router.post('/get-instore-product-sub-category2', (req, res, next) => {
    specialCategoriesServices.getProductSubCategory2ProductsinStore(req.body, (data) => {
        res.send(data);
    })
});

router.post('/get-not-instore-product-category',  (req, res, next) => {
    specialCategoriesServices.getNotInStoreProductCategory(req.body, (data) => {
        res.send(data);
    })
});
router.post('/get-not-instore-product-sub-category',   (req, res, next) => {
    specialCategoriesServices.getNotInstoreProductSubCategory(req.body, (data) => {
        res.send(data);
    })
});

router.post('/master-product-allergen-alias-not-instore',   (req, res, next) => {
    specialCategoriesServices.getMasterProductAllergenAliasNotInStore(req.body, (data) => {
        res.send(data);
    })
});

router.post('/get-grocery-store',   (req, res, next) => {
    specialCategoriesServices.getGroceryStores(req.body, (data) => {
        res.send(data);
    })
});
module.exports = router;