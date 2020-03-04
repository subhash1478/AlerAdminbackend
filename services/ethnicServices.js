var db= require('../services/connection-services');
var response= require('../services/response-services');
 
var ethnicServices ={
 
    addEthnic: async (data, callback) => {
        const connection = db.doConnection();
          var sqlEdit = `select * from alertrak.ethnic_type`;
          connection.query(sqlEdit, (err, result) => {
            if (err) {
                callback(response.json(err))
            }
            else {
                callback(response.json(null,result))
            }
        });
        // end connection
        connection.end();
    },
}
module.exports = ethnicServices;