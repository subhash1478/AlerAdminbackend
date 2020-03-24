var mysql = require('mysql');
require('dotenv').config();

var connection_reader = mysql.createConnection({
    //host: "auroradb.cluster-ch4t7yqcxslx.us-east-1.rds.amazonaws.com",
    host: process.env.DB_HOST_READER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306,
    database: 'alertrak',
    //debug: true,
    multipleStatements: true
    //timeout: 60000
});

connection_reader.connect(function(err) {
    if (err) throw err;
});

module.exports = connection_reader;