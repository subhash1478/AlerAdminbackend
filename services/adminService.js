var async = require("async");
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
// var foodItemAllergen = require('../common_functions/foodItems-Allergen');
// var allergenToAlias = require('../common_functions/allergen-to-alias');
// var mailProperty = require('../modules/sendMail');
var csvtojson = require("csvtojson");
var fs = require('fs');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
var loginRegister = {
    jwtAuthVerification: (jwtData, callback) => {
        if (jwtData.authtoken) {
            jwt.verify(jwtData.authtoken, process.env.secretKey, function (err, decoded) {
                if (err) {
                    callback({
                        response_code: 4000,
                        response_message: "Session timeout! Please login again.",
                        response_data: err
                    });
                } else {
                    callback({
                        response_code: 2000,
                        response_message: "Authenticate successfully.",
                        response_data: decoded
                    });
                }
            });
        } else {
            callback({
                "response_code": 5002,
                "response_message": "Please provide required information"
            })
        }
    },
    // Connection Function
    connection: () => {


        // Provide connection details
        var connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: 3306,
            //debug: true,
            multipleStatements: true
            //timeout: 60000
        });

        connection.connect(function (err) {
            if (err) {
                callback(err)
            }

            //callback(null, 'Connected to database.', connection)
        });
        return connection;

    },

    testEmail: (data, protocol, host, callback) => {
        mailProperty('userMail')(data.email, {
            name: "Surojit",
            email: "Paul",
            email_validation_url: `${protocol}://${host}`
        }).send();
    },
    // Login function
    login: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        // user select query
        let sqlUser = `SELECT userID,firstName,email,password,emailVerify,IsAdmin FROM alertrak.Users where email = '${data.email}' AND IsAdmin = '1'`;

        connection.query(sqlUser, function (err, result) {
            if (err) {

                callback({
                    success: false,
                    STATUSCODE: 5010,
                    message: "Wrong password or email. Please provide registered details.",
                    response: {}
                });
            }
            if (result.length === 0) {

                callback({
                    success: false,
                    STATUSCODE: 5010,
                    message: "Wrong password or email. Please provide registered details.",
                    response: {}
                });
            } else {
                // Compare Password
                var comparePass = bcrypt.compareSync(data.password, result[0].password);
                if (comparePass == true) {

                    if (result[0].emailVerify === '0') {
                        // callback({
                        //     "response_code": 5010,
                        //     "response_message": "Please verify email",
                        //     "response_data": {}
                        // });
                        callback({
                            success: false,
                            STATUSCODE: 5010,
                            message: "Please verify email",
                            response: {}
                        });
                    } else {
                        // generate token
                        var token = jwt.sign({
                            email: result[0].email,
                            id: result[0].userID
                        }, process.env.secretKey, {
                            expiresIn: '8760h'
                        });


                        // login callback
                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Login success",
                            response: {
                                email: result[0].email,
                                token: token,
                                "id": result[0].userID
                            }
                        });
                    }

                } else {

                    callback({
                        success: false,
                        STATUSCODE: 5010,
                        message: "Wrong password or email. Please provide registered details.",
                        response: {}
                    });
                }

            }


        });
        // end connection
        connection.end();


    },
    // GET all user
    listUserService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        let sqlTotalUser = `SELECT count(*) as count FROM alertrak.Users `;
        // user select query
        let sqlUser = `(SELECT * FROM alertrak.Users `;
        if (data.searchTerm) {
            sqlTotalUser += `WHERE 
            firstName LIKE '%${data.searchTerm}%' OR 
            email LIKE '%${data.searchTerm}%'`;
            sqlUser += `WHERE 
            firstName LIKE '%${data.searchTerm}%' OR 
            email LIKE '%${data.searchTerm}%'
            LIMIT ${data.offset}, ${data.limit})`;
        } else {
            sqlUser += `LIMIT ${data.offset}, ${data.limit})`;
        }

        let joinSql = sqlTotalUser + ';' + sqlUser

        connection.query(joinSql, [2, 1], function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();


    },
    // Edit user
    editUserService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        var exclution = data.Exclusion ? data.Exclusion : '';

        // EDIT query
        var sqlEdit = `UPDATE alertrak.Users SET firstName= '${data.firstName}', email= '${data.email}', 
        emailVerify='${data.emailVerify}', IsAdmin='${data.IsAdmin}' WHERE userID='${data.userID}'`;


        connection.query(sqlEdit, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    // GET all user Settings
    listUserSettingsService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        let sqlTotalUser = `SELECT count(*) as count FROM alertrak.UserSettings `;
        // user select query
        let sqlUser = `(SELECT * FROM alertrak.UserSettings `;
        if (data.searchTerm) {
            sqlTotalUser += `WHERE 
            Member LIKE '%${data.searchTerm}%' OR 
            CustomNames LIKE '%${data.searchTerm}%'`;
            sqlUser += `WHERE 
            Member LIKE '%${data.searchTerm}%' OR 
            CustomNames LIKE '%${data.searchTerm}%'
            LIMIT ${data.offset}, ${data.limit})`;
        } else {
            sqlUser += `LIMIT ${data.offset}, ${data.limit})`;
        }

        let joinSql = sqlTotalUser + ';' + sqlUser

        connection.query(joinSql, [2, 1], function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();


    },
    // GET all Allergen Alias
    listAllergeanAliasService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        let sqlTotalUser = `SELECT count(*) as count FROM alertrak.AllergenAlias `;
        // user select query
        let sqlUser = `SELECT * FROM alertrak.AllergenAlias `;
        if (!data.allData) {
            if (data.searchTerm) {
                sqlTotalUser += `WHERE 
                Allergen LIKE '%${data.searchTerm}%' OR 
                Alias LIKE '%${data.searchTerm}%' OR 
                Exclusion LIKE '%${data.searchTerm}%'`;
                sqlUser += `WHERE 
                Allergen LIKE '%${data.searchTerm}%' OR 
                Alias LIKE '%${data.searchTerm}%' OR 
                Exclusion LIKE '%${data.searchTerm}%'
                LIMIT ${data.offset}, ${data.limit}`;
            } else {
                sqlUser += `LIMIT ${data.offset}, ${data.limit}`;
            }
        }

        let joinSql = sqlTotalUser + ';' + sqlUser

        connection.query(joinSql, [2, 1], function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();


    },
    // Edit all Allergen Alias
    addEditAllergenAliasService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        var exclution = data.Exclusion ? data.Exclusion : '';

        // EDIT query
        var sqlEdit = `UPDATE alertrak.AllergenAlias SET Allergen= '${data.Allergen}', Alias= '${data.Alias}', 
        Exclusion='${data.Exclusion}', StatusFlag='${data.StatusFlag}' WHERE AliasID='${data.AliasID}'`;
        //INSERT query
        var sqlInsert = `INSERT INTO alertrak.AllergenAlias (Allergen, Alias, Exclusion, StatusFlag) 
        VALUES ("${data.Allergen} ", "${data.Alias}", "${exclution}", "${data.StatusFlag}")`;

        var sql = "";
        if (data.AliasID) {

            sql = sqlEdit;
        } else {

            sql = sqlInsert;
        }

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    // Delete Allergen Alias
    deleteAllergenAliasService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()


        // EDIT query
        var sql = `DELETE FROM alertrak.AllergenAlias WHERE AliasID='${data.AliasID}'`;

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    csvUploadAllergenAlias: async (files, callback) => {
        files.csv.mv('./public/' + files.csv.name, function (err) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            } else {
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: files.csv.name
                });
            }

        })

    },
    // csvDataReadAndInsertAllergenAlias: async (data, callback) => {
    //     if(data.fileName != "AllergenAlias-Template.csv"){
    //         callback({
    //             success: false,
    //             STATUSCODE: 4200,
    //             message: "Please choose correct file",
    //             response: ''
    //         });
    //     }else{
    //         csvtojson()
    //         .fromFile('./public/' + data.fileName)
    //         .then(async (jsonObj) => {
    //             await allergenToAlias(jsonObj).then(r =>{
    //                 //console.log("----",r);
                    
    //                 fs.unlink('./public/' + data.fileName, (err) => {
    //                             if (err) throw err;
    //                         });
    //                 callback({
    //                             success: true,
    //                             STATUSCODE: 2000,
    //                             message: "Success",
    //                             response: r
    //                         });
                    
    //             })
    //             .catch(errRes => {
    //                 //console.error(errRes);
                    
    //                 fs.unlink('./public/' + data.fileName, (err) => {
    //                     if (err) throw err;
    //                 });
    //                 callback({
    //                     success: false,
    //                     STATUSCODE: 4200,
    //                     message: "Failed",
    //                     response: errRes
    //                 });
    //             })
    //             // var sqlTruncate = `TRUNCATE alertrak.AllergenAlias`;
    //             // var insertQuery = `INSERT INTO alertrak.AllergenAlias (Allergen, Alias, Exclusion) VALUES `
    //             // var counter = 0;
    //             // await async.each(jsonObj, (res, cb) => {
    //             //     counter++;
    //             //     if (counter !== jsonObj.length) {
    //             //         insertQuery += `("${res.Allergen} ", "${res.Alias}", "${res.Exclusion}"),`;
    //             //     } else {
    //             //         insertQuery += `("${res.Allergen} ", "${res.Alias}", "${res.Exclusion}")`;
    //             //     }

    //             // })

    //             // let joinSql = sqlTruncate + ';' + insertQuery
    //             // connection.query(joinSql, [2, 1], function (err, result) {
    //             //     fs.unlink('./public/' + data.fileName, (err) => {
    //             //         if (err) throw err;

    //             //     });
    //             //     if (err) {
    //             //         callback({
    //             //             success: false,
    //             //             STATUSCODE: 4200,
    //             //             message: "Failed",
    //             //             response: err
    //             //         });
    //             //     }
    //             //     else {

    //             //         callback({
    //             //             success: true,
    //             //             STATUSCODE: 2000,
    //             //             message: "Success",
    //             //             response: result
    //             //         });
    //             //     }


    //             // });
    //             // // end connection
    //             // connection.end();




    //         })
    //         .catch(err => {
    //             callback({
    //                 success: false,
    //                 STATUSCODE: 4200,
    //                 message: "Something Went wrong",
    //                 response: ''
    //             });
    //         })
    //     }
        
    // },
    csvDownloadAllergenAlias: async (data, callback) => {
        // create connection
        const connection = loginRegister.connection();
        // let sqlCSV = `SELECT * FROM alertrak.AllergenAlias INTO OUTFILE ./public/demo.csv' 
        // FIELDS ENCLOSED BY '\"' 
        // TERMINATED BY ';' 
        // ESCAPED BY '\"' 
        // LINES TERMINATED BY '\r\n'`;

        let sqlCSV = `SELECT * INTO OUTFILE './public/demo.csv'
        FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
        LINES TERMINATED BY '\n'
        FROM alertrak.AllergenAlias`;
        connection.query(sqlCSV, function (err, result) {

            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();
    },
    // GET all Allergen
    listAllergeanService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        let sqlTotalUser = `SELECT count(*) as count FROM alertrak.Allergen `;
        // user select query
        let sqlUser = `SELECT * FROM alertrak.Allergen `;
        if (!data.allData) {
            if (data.searchTerm) {
                sqlTotalUser += `WHERE 
                 
                AllergenName LIKE '%${data.searchTerm}%'`;
                sqlUser += `WHERE 
                 
                AllergenName LIKE '%${data.searchTerm}%'
                LIMIT ${data.offset}, ${data.limit}`;
            } else {
                sqlUser += `LIMIT ${data.offset}, ${data.limit}`;
            }
        }

        let joinSql = sqlTotalUser + ';' + sqlUser

        connection.query(joinSql, [2, 1], function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();
    },
    // Add Edit all Allergen
    addEditAllergenService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        var exclution = data.Exclusion ? data.Exclusion : '';

        // EDIT query
        var sqlEdit = `UPDATE alertrak.Allergen SET AllergenName= '${data.AllergenName}', StatusFlag='${data.StatusFlag}' 
        WHERE AllergenID='${data.AllergenID}'`;
        //INSERT query
        var sqlInsert = `INSERT INTO alertrak.Allergen (AllergenName) 
        VALUES ("${data.AllergenName} ")`;

        var sql = "";
        if (data.AllergenID) {
            sql = sqlEdit;
        } else {

            sql = sqlInsert;
        }

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    // Delete Allergen
    deleteAllergenService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()


        // EDIT query
        var sql = `DELETE FROM alertrak.Allergen WHERE AllergenID='${data.AllergenID}'`;

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    // GET all Alias
    listAliasService: async (data, callback) => {
        // create connection
        const connection = loginRegister.connection()
        let sqlTotalUser = `SELECT count(*) as count FROM alertrak.Alias `;
        // user select query
        let sqlUser = `SELECT * FROM alertrak.Alias `;
        if (!data.allData) {
            if (data.searchTerm) {
                sqlTotalUser += `WHERE 
                Exclusion LIKE '%${data.searchTerm}%' OR
                AliasName LIKE '%${data.searchTerm}%'`;
                sqlUser += `WHERE 
                Exclusion LIKE '%${data.searchTerm}%' OR
                AliasName LIKE '%${data.searchTerm}%'
                LIMIT ${data.offset}, ${data.limit}`;
            } else {
                sqlUser += `LIMIT ${data.offset}, ${data.limit}`;
            }
        }

        let joinSql = sqlTotalUser + ';' + sqlUser

        connection.query(joinSql, [2, 1], function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();
    },


    // GET all list food items
    listFoodItemsService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        let sqlTotalUser = `SELECT count(*) as count FROM alertrak.FoodItems `;
        // user select query
        let sqlUser = `(SELECT * FROM alertrak.FoodItems `;
        if (!data.allData) {
            if (data.searchTerm) {
                sqlTotalUser += `WHERE 
                Type LIKE '%${data.searchTerm}%' OR 
                Name LIKE '%${data.searchTerm}%' OR 
                Comments LIKE '%${data.searchTerm}%' OR 
                "Condition" LIKE '%${data.searchTerm}%'`;
                sqlUser += `WHERE 
                Type LIKE '%${data.searchTerm}%' OR 
                Name LIKE '%${data.searchTerm}%' OR 
                Comments LIKE '%${data.searchTerm}%' OR `;
                sqlUser += "`Condition` LIKE '%" + data.searchTerm + "%'"
                sqlUser += `LIMIT ${data.offset}, ${data.limit})`;
            } else {
                sqlUser += `LIMIT ${data.offset}, ${data.limit})`;
            }
        }
        else {
            sqlUser += `)`;
        }

        let joinSql = sqlTotalUser + ';' + sqlUser

        connection.query(joinSql, [2, 1], function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err,
                    query: sqlUser
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();
    },
    // GET distinct Food Item Type
    foodItemTypeService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()

        // user select query
        let sql = `SELECT DISTINCT(Type) FROM alertrak.FoodItems `;


        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err,
                    query: sql
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result.length,
                    response: result
                });
            }


        });
        // end connection
        connection.end();
    },
    // Add edit list food items
    addEditlistFoodItemsService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        var Condition = data.Condition ? data.Condition : '';
        var Comments = data.Comments ? data.Comments.replace(/'/g, "\\'").replace(/"/g, '\\"') : '';
        var StatusFlag = data.StatusFlag ? data.StatusFlag : 0;
        var DeleteStatus = data.DeleteStatus ? data.DeleteStatus : 0;

        // EDIT query
        var sqlEdit = `UPDATE alertrak.FoodItems SET Type= '${data.Type}',Name= '${data.Name}',AlergenId= '${data.AlergenId}',`;
        sqlEdit += "`Condition` = '" + Condition + "',";
        sqlEdit += `Comments='${Comments}', StatusFlag='${StatusFlag}', DeleteStatus='${DeleteStatus} ' 
        WHERE ItemID='${data.ItemID}'`;
        //INSERT query
        var sqlInsert = "INSERT INTO alertrak.FoodItems (`Type`, `Name`, `AlergenId`, `Condition`, `Comments`) ";
        sqlInsert += `VALUES ('${data.Type}' , '${data.Name}', '${data.AlergenId}', '${Condition}', '${Comments}')`;

        var sql = "";
        if (data.ItemID) {

            sql = sqlEdit;
        } else {

            sql = sqlInsert;
        }

        connection.query(sql, function (err, result) {
            if (err) {

                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    // Delete Food Item
    deleteListFoodItemsService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()


        // EDIT query
        var sql = `DELETE FROM alertrak.FoodItems WHERE ItemID='${data.ItemID}'`;

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    // Data read from CSV list food items
    // csvDataReadAndInsertListFoodItemsService: async (data, callback) => {
    //     if(data.fileName != "foodItem-Template.csv"){
    //         callback({
    //             success: false,
    //             STATUSCODE: 4200,
    //             message: "Please choose correct file",
    //             response: ''
    //         });
    //     }else{
    //         csvtojson()
    //             .fromFile('./public/' + data.fileName)
    //             .then(async (jsonObj) => {
    //                 foodItemAllergen(jsonObj).then(r =>{
    //                     //console.log("----",r);
                        
    //                     fs.unlink('./public/' + data.fileName, (err) => {
    //                                 if (err) throw err;
    //                             });
    //                     callback({
    //                                 success: true,
    //                                 STATUSCODE: 2000,
    //                                 message: "Success",
    //                                 response: r
    //                             });
                        
    //                 })
    //                 .catch(errRes => {
    //                     //console.error(errRes);
                        
    //                     fs.unlink('./public/' + data.fileName, (err) => {
    //                         if (err) throw err;
    //                     });
    //                     callback({
    //                         success: false,
    //                         STATUSCODE: 4200,
    //                         message: "Failed",
    //                         response: errRes
    //                     });
    //                 })
    //                 // var sqlTruncate = `TRUNCATE alertrak.FoodItems`;
    //                 // var insertQuery = "INSERT INTO alertrak.FoodItems (`Type`, `Name`, `Condition`, `Comments`) VALUES "
    //                 // var counter = 0;
    //                 // await async.each(jsonObj, (res, cb) => {
    //                 //     counter++;
    //                 //     if (counter !== jsonObj.length) {
    //                 //         insertQuery += `("${res.Type} ", "${res.Name}", "${res.Condition}", "${res.Comments}"),`;
    //                 //     } else {
    //                 //         insertQuery += `("${res.Type} ", "${res.Name}", "${res.Condition}", "${res.Comments}")`;
    //                 //     }

    //                 // })

    //                 // let joinSql = sqlTruncate + ';' + insertQuery
    //                 // connection.query(joinSql, [2, 1], function (err, result) {
    //                 //     fs.unlink('./public/' + data.fileName, (err) => {
    //                 //         if (err) throw err;
    //                 //     });
    //                 //     if (err) {
    //                 //         callback({
    //                 //             success: false,
    //                 //             STATUSCODE: 4200,
    //                 //             message: "Failed",
    //                 //             response: err
    //                 //         });
    //                 //     }
    //                 //     else {

    //                 //         callback({
    //                 //             success: true,
    //                 //             STATUSCODE: 2000,
    //                 //             message: "Success",
    //                 //             response: result
    //                 //         });
    //                 //     }


    //                 // });
    //                 // // end connection
    //                 // connection.end();




    //             })
    //             .catch(err => {
    //                 callback({
    //                     success: false,
    //                     STATUSCODE: 4200,
    //                     message: "Something Went wrong",
    //                     response: ''
    //                 });
    //             })
    //         }
    // },
    // GET All product //
    listAllProductsService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        let sqlTotalUser = `SELECT count(*) as count FROM alertrak.Products `;
        // user select query
        let sqlUser = `SELECT * FROM alertrak.Products `;
        if (data.searchTerm) {
            sqlTotalUser += `WHERE 
            ProductName LIKE '%${data.searchTerm}%' OR 
            UPCEAN LIKE '%${data.searchTerm}%' OR
            SourceID LIKE '%${data.searchTerm}%' OR 
            Ingredients LIKE '%${data.searchTerm}%'`;
            sqlUser += `WHERE 
            ProductName LIKE '%${data.searchTerm}%' OR 
            UPCEAN LIKE '%${data.searchTerm}%' OR
            SourceID LIKE '%${data.searchTerm}%' OR 
            Ingredients LIKE '%${data.searchTerm}%'
            LIMIT ${data.offset}, ${data.limit}`;
        } else {
            sqlUser += `LIMIT ${data.offset}, ${data.limit}`;
        }

        let joinSql = sqlTotalUser + ';' + sqlUser

        connection.query(joinSql, [2, 1], function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success" + result.length,
                    totalData: result[0][0].count,
                    response: result[1]
                });
            }


        });
        // end connection
        connection.end();


    },
    addEditProductService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()
        var Condition = data.Condition ? data.Condition : '';
        var Comments = data.Comments ? data.Comments : '';

        // EDIT query
        var sqlEdit = `UPDATE alertrak.Products SET SourceID= '${data.SourceID}',ProductName= '${data.ProductName}', 
        Source= '${data.Source}',UPCEAN='${data.UPCEAN}', Manufacturer='${data.Manufacturer}', Ingredients='${data.Ingredients}' 
        WHERE ProductID='${data.ProductID}'`;
        //INSERT query
        var sqlInsert = "INSERT INTO alertrak.Products (`SourceID`, `ProductName`, `Source`, `UPCEAN`, `Manufacturer`, `Ingredients`) ";
        sqlInsert += `VALUES ('${data.SourceID}' , '${data.ProductName}', '${data.Source}', '${data.UPCEAN}', '${data.Manufacturer}', '${data.Ingredients}')`;

        var sql = "";
        if (data.ProductID) {

            sql = sqlEdit;
        } else {

            sql = sqlInsert;
        }

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    teamsService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()

        // Select query
        var sqlSelect = `SELECT Terms, ID FROM alertrak.TermsPrivacy`;
        var sql = "";
        if (data.ID) {
            // update query
            var sqlUpdate = `UPDATE alertrak.TermsPrivacy SET Terms='${data.Terms}' WHERE ID='1'`;
            sql = sqlUpdate;
        } else {
            sql = sqlSelect;
        }

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    privacyService: async (data, callback) => {

        // create connection
        const connection = loginRegister.connection()

        // Select query
        var sqlSelect = `SELECT Privacy, ID FROM alertrak.TermsPrivacy`;
        var sql = "";
        if (data.ID) {
            // update query
            var sqlUpdate = `UPDATE alertrak.TermsPrivacy SET Privacy='${data.Privacy}' WHERE ID='1'`;
            sql = sqlUpdate;
        } else {
            sql = sqlSelect;
        }

        connection.query(sql, function (err, result) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 4200,
                    message: "Failed",
                    response: err
                });
            }
            else {

                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Success",
                    response: result
                });
            }


        });
        // end connection
        connection.end();


    },
    setPassword: async (data, callback) => {
        // Create connection
        const connection = loginRegister.connection()
        // select user
        let sqlUser = `SELECT userID,firstName,email,password FROM alertrak.Users where userID = '${data.userId}'`;

        connection.query(sqlUser, function (err, result) {
            // Check user exist or not
            if (result.length === 0) {
                callback({
                    "response_code": 5002,
                    "response_message": "User does not exist",
                    "response_data": {}
                });
            } else {
                // set compare pass default true
                var comparePass = true;
                //check it is forgot password or not
                if (data.forgotPassword === "0") {
                    comparePass = bcrypt.compareSync(data.currentpassword, result[0].password);
                }
                // check compare pass
                if (comparePass == true) {
                    // hash password
                    bcrypt.hash(data.password, null, null, function (err, hash) {
                        if (err) {
                            callback({
                                "response_code": 5005,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": err
                            });
                        } else {
                            // Update pass
                            let UpdatePass = `UPDATE alertrak.Users SET password = '${hash}'  where userID = '${data.userId}'`;

                            connection.query(UpdatePass, function (err, resultUpdate) {
                                callback({
                                    "response_code": 2000,
                                    "response_message": "Password has been changed.",
                                    "response_data": resultUpdate
                                });

                            });
                        }
                    });

                } else {
                    callback({
                        "response_code": 5020,
                        "response_message": "Current password is wrong.",
                        "response_data": []
                    });
                }
            }
        });
        // Connection End
        await waitFor(5000);
        connection.end();


    },
    // Edit profile
    editProfile: async (data, protocol, host, callback) => {
        // Create connection
        const connection = loginRegister.connection()
        // Select user query
        let sqlUser = `SELECT userID,email,firstName FROM alertrak.Users where userID = '${data.userId}'`;

        connection.query(sqlUser, async function (err, result) {
            // Check user 
            if (result.length === 0) {
                callback({
                    "response_code": 5002,
                    "response_message": "User does not exist",
                    "response_data": {}
                });
            } else {
                var responce_msg = "";
                var email_change;
                // change first name
                if (data.firstName && data.firstName !== "") {
                    let sqlUser = `UPDATE alertrak.Users SET firstName = '${data.firstName}'  where userID = '${data.userId}'`;

                    await connection.query(sqlUser, function (err, resultUpdate) {

                    });
                    responce_msg += "First name changed successfully. ";
                    email_change = 0;
                }
                // change email
                if (data.email && data.email !== "") {

                    if (data.email === result[0].email) {
                        responce_msg += "New email address same as old email address. ";
                        email_change = 0;
                    } else {
                        var tokenId = jwt.sign({
                            id: data.userId
                        }, process.env.secretKey, {
                            expiresIn: '24h'
                        });

                        var rString = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

                        mailProperty('userMail')(data.email, {
                            name: result[0].firstName,
                            email: data.email,
                            email_validation_url: `${protocol}://${host}/verify-account/verify-change-email/${rString}${tokenId}/${data.email}`,
                            url: `${protocol}://${host}`
                        }).send();

                        let sqlemail = `UPDATE alertrak.Users SET emailVerify = '0'  where userID = '${data.userId}'`;

                        await connection.query(sqlemail, function (err, resultUpdate) { });

                        responce_msg += "To change email please verify your new email. ";
                        email_change = 1;
                    }
                }
                // send responce
                process.nextTick(() => {
                    callback({
                        "response_code": 2000,
                        "response_message": responce_msg,
                        email_change,
                        "response_data": {}
                    });
                })



            }

        });
        // end connection
        await waitFor(5000);
        connection.end();


    },
    // Suggestion
    suggestion: async (data, callback) => {

        // Create connection
        const connection = loginRegister.connection()
        // insert into suggestion table
        let sqlSugInsert = `INSERT INTO  alertrak.Suggestion (email,SuggestionText) VALUES ('${data.email}','${data.text}')`;
        // Send mail to user
        mailProperty('thankYouSuggestion')(data.email, {

        }).send();
        // Send mail to admin
        mailProperty('suggestionAdmin')("support@alertrak.com", {
            email: data.email,
            suggestion: data.text
        }).send();

        connection.query(sqlSugInsert, function (err, result) {
            if (!result) {
                callback({
                    "response_code": 5002,
                    "response_message": "Something went wrong",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 2000,
                    "response_message": "Suggestion submitted successfully !",
                    "response_data": result
                });
            }

        });
        // End connection
        connection.end();


    },
    // Terms And service
    termsServices: async (data, callback) => {
        // Create connection
        const connection = loginRegister.connection();
        // Select Tearms and Privecy
        let sql = `SELECT * FROM  alertrak.TermsPrivacy WHERE ID = '1'`;

        connection.query(sql, function (err, result) {
            if (!result) {
                callback({
                    "response_code": 5002,
                    "response_message": "Something went wrong",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 2000,
                    "response_message": "Success",
                    "response_data": {
                        "Terms": result[0].Terms,
                        "Privacy": result[0].Privacy
                    }
                });
            }
        });
        // End connection
        await waitFor(5000);
        connection.end();
    },
    // Event log
    eventLog: async (data, callback) => {
        const connection = loginRegister.connection();
        // Select event log
        let sql = `SELECT * FROM  alertrak.EventLog`;

        connection.query(sql, function (err, result) {
            if (!result) {
                callback({
                    "response_code": 5002,
                    "response_message": "Something went wrong",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 2000,
                    "response_message": "Success",
                    "response_data": result
                });
            }
        });
        // end connection
        await waitFor(5000);
        connection.end();
    },
    // Resend verification email
    resendVerificationEmail: async (data, protocol, host, callback) => {
        // Create connection
        const connection = loginRegister.connection()
        // select user
        let sqlUser = `SELECT userID,email,firstName FROM alertrak.Users where email = '${data.email}'`;

        connection.query(sqlUser, async function (err, result) {
            // Check user
            if (result.length === 0) {
                callback({
                    "response_code": 5002,
                    "response_message": "User does not exist",
                    "response_data": {}
                });
            } else {


                if (result[0].email) {

                    // generate token
                    var tokenId = jwt.sign({
                        id: result[0].userID
                    }, process.env.secretKey, {
                        expiresIn: '24h'
                    });
                    //generate random string
                    var rString = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    // send email
                    mailProperty('userMail')(result[0].email, {
                        name: result[0].firstName,
                        email: result[0].email,
                        email_validation_url: `${protocol}://${host}/verify-account/verify-change-email/${rString}${tokenId}/${data.email}`,
                        url: `${protocol}://${host}`
                    }).send();
                    // callback
                    process.nextTick(() => {
                        callback({
                            "response_code": 2000,
                            "response_message": "Email sent successfully",
                            "response_data": {}
                        });
                    })

                } else {
                    callback({
                        "response_code": 5002,
                        "response_message": "User does not exist",
                        "response_data": {}
                    });
                }





            }

        });
        // end connection
        await waitFor(5000);
        connection.end();

    },
    // Send forgot Password email
    sendForgotPasswordEmail: async (data, protocol, host, callback) => {
        //create connection
        const connection = loginRegister.connection()
        // select user
        let sqlUser = `SELECT userID,email,firstName FROM alertrak.Users where email = '${data.email}'`;

        connection.query(sqlUser, async function (err, result) {
            if (result.length === 0) {
                callback({
                    "response_code": 5002,
                    "response_message": "User does not exist",
                    "response_data": {}
                });
            } else {
                if (result[0].email) {
                    //create random string
                    var rString = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    // send email
                    mailProperty('forgotPassword')(result[0].email, {
                        name: result[0].firstName,
                        email: result[0].email,
                        code: `${rString}`,
                        url: `${protocol}://${host}`
                    }).send();
                    // callback
                    process.nextTick(() => {
                        var tokenId = jwt.sign({
                            id: result[0].userID,
                            code: rString
                        }, process.env.secretKey, {
                            expiresIn: '24h'
                        });
                        callback({
                            "response_code": 2000,
                            "response_message": "Email sent successfully",
                            "response_data": {
                                "token": tokenId
                            }
                        });
                    })

                } else {
                    callback({
                        "response_code": 5002,
                        "response_message": "User does not exist",
                        "response_data": {}
                    });
                }





            }

        });
        // end connection
        await waitFor(5000);
        connection.end();

    },
    // Forgot password code verify
    forgotPasswordCodeVerify: (data, callback) => {
        if (data.token) {
            // Verify token
            jwt.verify(data.token, process.env.secretKey, function (err, decoded) {
                if (err) {
                    callback({
                        response_code: 4000,
                        response_message: "Session timeout! Please resend your code.",
                        response_data: err
                    });
                } else {
                    if (decoded.code === data.code) {
                        callback({
                            response_code: 2000,
                            response_message: "Authenticate successfully.",
                            response_data: {
                                userId: decoded.id
                            }
                        });
                    } else {
                        callback({
                            "response_code": 5002,
                            "response_message": "wrong password code"
                        })
                    }

                }
            });
        } else {
            callback({
                "response_code": 5002,
                "response_message": "Please provide required information"
            })
        }
    },
    // Get Set user settings
    getSetUserSettings: async (data, callback) => {

        if (data) {
            //main data
            var mainData = data.mainData;
            // create connection
            const connection = loginRegister.connection()
            // Get user settings
            if (data.type == "GET") {
                // get settings query
                let sqlUserSettings = `SELECT * FROM alertrak.UserSettings where userID = '${mainData.userId}'`;

                connection.query(sqlUserSettings, async function (err, result) {
                    if (result.length === 0) {
                        callback({
                            "response_code": 2000,
                            "response_message": "No data found",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 2000,
                            "response_message": "Data fetched successfully !!",
                            "response_data": result
                        });
                    }
                });
                // end connection
                await waitFor(5000);
                connection.end();
            } //Post user settings
            else if (data.type == "POST") {


                if (mainData.insertUpdate == "INSERT") {
                    //check id for 0
                    if (mainData.userId == 0) {
                        callback({
                            "response_code": 2002,
                            "response_message": "User id 0 is not allowed !",
                            "response_data": {}
                        });
                    } else {
                        // inset query
                        let insertSettings = `INSERT INTO  alertrak.UserSettings 
                            (userID,Member,ItemIDS,CustomNames, DefaultMember) 
                            VALUES 
                            ('${mainData.userId}','${mainData.member}','${mainData.itemIds ? mainData.itemIds : ''}', 
                            '${mainData.customNames ? mainData.customNames : ''}', '${mainData.defaultMember ? mainData.defaultMember : 0}')`;

                        connection.query(insertSettings, async function (err, resultIn) {
                            if (err) {
                                callback({
                                    "response_code": 5002,
                                    "response_message": "Insert Error",
                                    "response_data": err
                                });
                            } else {

                                callback({
                                    "response_code": 2000,
                                    "response_message": "Insert Successfully",
                                    "response_data": resultIn
                                });
                            }
                        });
                    }



                } else {
                    // Update query
                    let updateSettings = `UPDATE alertrak.UserSettings SET `;
                    if (mainData.itemIds) {
                        updateSettings += `ItemIDS = '${mainData.itemIds ? mainData.itemIds : ''}',`;
                    }
                    if (mainData.customNames) {
                        updateSettings += `CustomNames = '${mainData.customNames ? mainData.customNames : ''}',`;
                    }
                    updateSettings += ` Member = '${mainData.member}'
                                                where ID = '${mainData.rowId}'`;


                    connection.query(updateSettings, async function (err, resultUp) {
                        if (err) {
                            callback({
                                "response_code": 5002,
                                "response_message": "Update Error",
                                "response_data": err
                            });
                        } else {
                            //this.loginRegister.getSetUserSettings('GET')
                            callback({
                                "response_code": 2000,
                                "response_message": "Update Successfully",
                                "response_data": resultUp
                            });
                        }
                    });
                }
                //});
                //end connection
                await waitFor(5000);
                connection.end();
            }
            else {
                callback({
                    "response_code": 5002,
                    "response_message": "Please provide required information"
                })
            }
        }



    },

    //delete user settings
    deleteUserSettings: async (data, callback) => {

        const connection = loginRegister.connection();
        let sqlDeleteUserSettings = `DELETE FROM alertrak.UserSettings where ID = '${data.rowId}'`;

        connection.query(sqlDeleteUserSettings, async function (err, result) {
            if (!result) {
                callback({
                    "response_code": 5002,
                    "response_message": "No data found",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 2000,
                    "response_message": "Data deleted successfully !!",
                    "response_data": result
                });
            }
        });
        // end connection
        await waitFor(5000);
        connection.end();

    },
    /// add Edit Alias Service
    addEditAliasService: async (data, callback) => {
        const connection = loginRegister.connection();
        var exclution = data.Exclusion ? data.Exclusion : '';
        // EDIT query
        var sqlEdit = `UPDATE alertrak.alias SET AliasName= '${data.AliasName}',Exclusion= '${exclution}', StatusFlag='${data.StatusFlag}' WHERE AliasID='${data.AliasID}'`;
        //INSERT query
        var sqlInsert = `INSERT INTO alertrak.alias (AliasName,Exclusion) VALUES ("${data.AliasName}", "${exclution}")`;
        var sql = "";
        sql = (data.AliasID) ? sqlEdit : sqlInsert;
        connection.query(sql, (err, result) => {
            if (err) {
                callback({ success: false, STATUSCODE: 4200, message: "Failed", response: err });
            }
            else {
                callback({ success: true, STATUSCODE: 2000, message: "Success", response: result });
            }
        });
        // end connection
        connection.end();
    },
    // delete Alias Service
    deleteAliasService: async (data, callback) => {
        const connection = loginRegister.connection();
        // DELETE query
        var sql = `DELETE FROM alertrak.alias WHERE AliasID='${data.AliasID}'`;
        connection.query(sql, function (err, result) {
            if (err) {
                callback({ success: false, STATUSCODE: 4200, message: "Failed", response: err });
            }
            else {
                callback({ success: true, STATUSCODE: 2000, message: "Success", response: result });
            }
        });
        // end connection
        connection.end();
    },

    // getAllergenToAlias
    // delete Alias Service
    addRemove: async (data, callback) => {
        const connection = loginRegister.connection();
        let sqlInsert;
        // DELETE query
        if (data.action === 'ADD') {
            sqlInsert = `INSERT INTO alertrak.AllergenToAlias (AllergenID,AliasID) VALUES ("${data.AllergenID}", "${data.AliasID}")`;

        } else {
            sqlInsert = `DELETE FROM alertrak.AllergenToAlias WHERE AllergenID= '${data.AllergenID}' and AliasID= '${data.AliasID}'`;

        }

        connection.query(sqlInsert, function (err, result) {
            if (err) {
                callback({ success: false, STATUSCODE: 4200, message: "Failed", response: err });
            }
            else {
                callback({ success: true, STATUSCODE: 2000, message: "Success", response: result });
            }
        });
        // end connection
        connection.end();
    },
    // getAllergenToAlias
    // delete Alias Service
    getAddRemoveItem: async (data, callback) => {
        const connection = loginRegister.connection();
        let sqlInsert;
        // DELETE query
        sqlInsert = `SELECT * FROM  alertrak.AllergenToAlias where ${data.tblColumnName}='${data.id}'`;


        connection.query(sqlInsert, function (err, result) {
            if (err) {
                callback({ success: false, STATUSCODE: 4200, message: "Failed", response: err });
            }
            else {
                callback({ success: true, STATUSCODE: 2000, message: "Success", response: result });
            }
        });
        // end connection
        connection.end();
    },
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


module.exports = loginRegister;