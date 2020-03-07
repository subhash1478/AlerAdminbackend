var mysql = require('mysql');
var connectionServices = {
    doConnection: () => {
        // Provide connection details
        var connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: 3306,
            //debug: true,
            multipleStatements: true,
            typeCast: function castField(field, useDefaultTypeCasting) {
                if ((field.type === "BIT") && (field.length === 1)) {
                    var bytes = field.buffer();
                    return (bytes[0] === 1);
                }
                return (useDefaultTypeCasting());
            }
            //timeout: 60000
        });
        connection.connect(function (err, callback) {
            if (err) {
                callback(err)
            }
            //callback(null, 'Connected to database.', connection)
        });
        return connection;
    }
}
module.exports = connectionServices;