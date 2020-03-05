const db = require('../services/connection-services');
const response = require('../services/response-services');
const tblName = 'alertrak.ethnic_type'
const primaryKey = 'EthnicID'
var ethnicServices = {
    addEditEthnic: async (data, callback) => {
        const connection = db.doConnection();
        let sqlEdit = `UPDATE ${tblName} SET EthnicName= '${data.EthnicName}' WHERE ${primaryKey}='${data[primaryKey]}'`; // EDIT query
        let sqlInsert = `INSERT INTO ${tblName} (EthnicName) VALUES ('${data.EthnicName}')`; //INSERT query
        const sql = (data.EthnicID) ? sqlEdit : sqlInsert;
        connection.query(sql, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null, result))
            }
        });
        connection.end();
    },
    deleteEthnic: async (data, callback) => {
        const connection = db.doConnection();
        var sql = `DELETE FROM ${tblName} WHERE ${primaryKey}='${data[primaryKey]}'`; // Delete query
        connection.query(sql, function (err, result) {
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