const db = require('./connection-services');
const response = require('./response-services');
const tblName = 'alertrak.specialcategories'
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