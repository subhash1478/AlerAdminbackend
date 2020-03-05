const db = require('./connection-services');
const response = require('./response-services');
const tblName = 'alertrak.specialcategories'
const primaryKey = 'categoryID'
let insertQuery = `INSERT INTO ${tblName}  SET ?`;
let updateQuery = `UPDATE ${tblName}  SET ?`;
let selectQuery = `SELECT * FROM ${tblName}`; 
let deleteQuery = `DELETE FROM ${tblName} WHERE ?`; // Delete query

var ethnicServices = {
    addEditSpecialCategories: async (data, callback) => {
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
        connection.query(deleteQuery, data,function (err, result) {
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