var connection_reader = require('../connection/connection_reader');
var connection_writer = require('../connection/connection_writer');
const db = require('./connection-services');
var async = require("async");
const response = require('./response-services');
const tblName = 'alertrak.SpecialCategories'
const primaryKey = 'categoryID'
function commaSeprateValue(specialcategoryID, data) {
    const array = specialcategoryID ? specialcategoryID.split(',') : [];
    let value = '';
    if (data.type === 'add') {
        if (array.length > 0) {
            if (array.indexOf(data.specialcategoryID) == -1) {
                array.push(data.specialcategoryID);
            }
            value = array.join(',');
        } else {
            value = data.specialcategoryID;
        }
    } else {
        if (array.length < 1) {
            value = ''
        } else {
            value = array.filter((item) => item !== data.specialcategoryID);
        }
    }
    return value;
}
var ethnicServices = {
    addEditSpecialCategories: async (data, callback) => {
        let updateQuery = `UPDATE ${tblName}  SET ?`;
        let insertQuery = `INSERT INTO ${tblName}  SET ?`;
        const connection = db.doConnection();
        updateQuery += ` WHERE ${primaryKey}='${data[primaryKey]}'`
        const sql = (data[primaryKey]) ? updateQuery : insertQuery;
        connection_writer.query(sql, data, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
    },
    getSpecialCategories: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT * FROM ${tblName}`;
        connection_reader.query(selectQuery, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
    },
    deleteSpecialCategories: async (data, callback) => {
        const connection = db.doConnection();
        let deleteQuery = `DELETE FROM ${tblName} WHERE ?`; // Delete query
        connection_writer.query(deleteQuery, data, function (err, result) {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
    },
    getMasterProductAllergenAlias: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT MasterId, t1.UPCEAN, ProductName,specialcategoryID FROM alertrak.MasterProductAllergenAlias t1
        INNER JOIN alertrak.ProductsinStore t2
        ON t1.UPCEAN = t2.UPCEAN 
        WHERE t2.product_category = '${data.product_category}'`;
        if (data.product_subcategory) {
            selectQuery += `and t2.product_subcategory='${data.product_subcategory}' `;
        }
        if (data.product_subcategory2) {
            selectQuery += `and t2.product_subcategory2='${data.product_subcategory2}'`;
        }
        connection_reader.query(selectQuery, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
    },
    mapProductAllergenAliasSpecialCategories: async (data, callback) => {
        const connection = db.doConnection();
        const setSpecialcategoryID = []
        async.each(data.MasterId, function (item, cb) {
            let selectQuery = `SELECT MasterId ,specialcategoryID FROM alertrak.MasterProductAllergenAlias WHERE MasterId='${item.MasterId}'`;
            connection_reader.query(selectQuery, data, (err, result) => {
                if (err) {
                    callback(response.json(err))
                }
                else {
                    setSpecialcategoryID.push({ value: commaSeprateValue(result[0].specialcategoryID, data), MasterId: item.MasterId })
                    cb();
                }
            });
        }, function () {
            const mastedID = setSpecialcategoryID.map(item => item.MasterId);
            //query
            let updateQuery = `UPDATE MasterProductAllergenAlias SET specialcategoryID = CASE MasterId`;
            setSpecialcategoryID.forEach((item) => { updateQuery += ` WHEN ${item.MasterId} THEN '${item.value}'\n` })
            updateQuery += ` END WHERE MasterId IN(`
            updateQuery += mastedID.join(',')
            updateQuery += `)`;

            connection_writer.query(updateQuery, (err, result) => {
                if (err) {
                    callback(response.json(err))
                }
                else {
                    callback(response.json(null, result))
                }
            });
        })
        // connection.end();
    },
    getProductCategoryProductsinStore: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT distinct product_category FROM alertrak.ProductsinStore where StoreID= '${data.StoreID}'`;
        connection_reader.query(selectQuery, data, function (err, result) {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
        // connection.end();
    },
    getProductSubCategoryProductsinStore: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT distinct product_subcategory FROM alertrak.ProductsinStore where StoreID= '${data.StoreID}' and product_category = '${data.product_category}';
         `;
         connection_reader.query(selectQuery, data, function (err, result) {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
        // connection.end();
    },
    getProductSubCategory2ProductsinStore: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT distinct product_subcategory2 FROM alertrak.ProductsinStore where StoreID= '${data.StoreID}' and product_category = '${data.product_category}' and product_subcategory='${data.product_subcategory}'`;
        connection_reader.query(selectQuery, data, function (err, result) {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
        // connection.end();
    },
    getNotInStoreProductCategory: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT DISTINCT product_category FROM alertrak.MasterProductAllergenAlias where product_category!='' `;
        connection_reader.query(selectQuery, data, function (err, result) {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
        // connection.end();
    },
    getNotInstoreProductSubCategory: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT DISTINCT product_subcategory FROM alertrak.MasterProductAllergenAlias where product_subcategory!='' and product_category='${data.product_category}' `;
        connection_reader.query(selectQuery, data, function (err, result) {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
        // connection.end();
    },
    getMasterProductAllergenAliasNotInStore: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT  MasterId , ProductName,specialcategoryID FROM alertrak.MasterProductAllergenAlias WHERE product_category='${data.product_category}'`;
        if (data.product_subcategory) {
            selectQuery += `and product_subcategory='${data.product_subcategory}'`;
        }
        console.log(selectQuery);
        

        connection_reader.query(selectQuery, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
    },
    getGroceryStores: async (data, callback) => {
        const connection = db.doConnection();
        let selectQuery = `SELECT StoreID, StoreName FROM alertrak.GroceryStores where ActiveFlag=1`;
        connection_reader.query(selectQuery, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
    },
}
module.exports = ethnicServices;