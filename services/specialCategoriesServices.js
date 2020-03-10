const db = require('./connection-services');
const response = require('./response-services');
const tblName = 'alertrak.Specialcategories'
const primaryKey = 'categoryID'
var ethnicServices = {
    addEditSpecialCategories: async (data, callback) => {
        let updateQuery = `UPDATE ${tblName}  SET ?`;
        let insertQuery = `INSERT INTO ${tblName}  SET ?`;
        const connection = db.doConnection();
        updateQuery += ` WHERE ${primaryKey}='${data[primaryKey]}'`
        const sql = (data[primaryKey]) ? updateQuery : insertQuery;
        connection.query(sql, data, (err, result) => {
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
        connection.query(selectQuery, (err, result) => {
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
        connection.query(deleteQuery, data, function (err, result) {
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
        let selectQuery = `SELECT MasterId ,ProductName,specialcategoryID FROM alertrak.masterproductallergenalias LIMIT ${data.offset}, ${data.limit}`;
        connection.query(selectQuery, (err, result) => {
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
        const joinQuery = ` WHERE MasterId='${data.MasterId}'`;
        let selectQuery = `SELECT MasterId ,specialcategoryID FROM alertrak.masterproductallergenalias `;
        selectQuery+=joinQuery
        connection.query(selectQuery, data, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                const specialcategoryID = result[0].specialcategoryID;
                let value = '';
                if (specialcategoryID.length === 0) {
                    const array = specialcategoryID.split(',').push(data.specialcategoryID).join(',');
                    value = array.join(',');
                } else {
                    value = data.specialcategoryID;
                }
                let updateQuery = `UPDATE alertrak.masterproductallergenalias  SET specialcategoryID='${value}'`;
                updateQuery += joinQuery;
                connection.query(updateQuery, (err, result) => {
                    if (err) {
                        callback(response.json(err))
                    }
                    else {
                        callback(response.json(null, result))
                    }
                });
            }
        });
        // connection.end();
    },
}
module.exports = ethnicServices;