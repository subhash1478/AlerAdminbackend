'use strict';
var express = require('express');
var router = express.Router();

//var express = require("express");
var loginRegister = require('../services/adminService');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

var jwt = require('jsonwebtoken');



//test sent email

router.post('/test-email', function (req, res) {
    if (!req.body.email) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide email address",
            "response_data": []
        });
    } else {
        loginRegister.testEmail(req.body, req.protocol, req.get('host'),function (result) {
            res.send(result);
        })
    }
});


router.post('/login', function (req, res) {
    if (!req.body.email) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide email address",
            "response_data": []
        });
    } else if (!req.body.password) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide password",
            "response_data": []
        });
    } else {
        loginRegister.login(req.body, function (result) {
            res.send(result)
        })
    }
});
// list user
router.post('/listUser', function (req, res) {
    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.listUserService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/editUser', function (req, res) {
    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.editUserService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
// list user
router.post('/listUserSettings', function (req, res) {
    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.listUserSettingsService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/listAllergeanAlias', function (req, res) {
    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.listAllergeanAliasService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});
router.post('/addEditAllergenAlias', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.addEditAllergenAliasService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/deleteAllergenAlias', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.deleteAllergenAliasService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/csvUploadAllergenAlias', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.csvUploadAllergenAlias(req.files, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/csvDataReadAndInsertAllergenAlias', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.csvDataReadAndInsertAllergenAlias(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/csvDownloadAllergenAlias', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.csvDownloadAllergenAlias(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});

////// Allergen Part /////////
router.post('/listAllergean', function (req, res) {    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.listAllergeanService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});
router.post('/addEditAllergen', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.addEditAllergenService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

}); 
router.post('/deleteAllergen', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.deleteAllergenService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});

//////// Alias Part //////
router.post('/listAlias', function (req, res) {    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.listAliasService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});



///// Food Items /////////
router.post('/listFoodItems', function (req, res) {    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.listFoodItemsService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});
router.post('/foodItemType', function (req, res) {    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.foodItemTypeService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});
router.post('/addEditlistFoodItems', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.addEditlistFoodItemsService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/deleteListFoodItems', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.deleteListFoodItemsService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
router.post('/csvDataReadAndInsertListFoodItems', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.csvDataReadAndInsertListFoodItemsService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});

/// PRODUCT MANAGEMENT ////
router.post('/listAllProducts', function (req, res) {
    
   
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.listAllProductsService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});
router.post('/addEditProduct', function (req, res) {

    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.addEditProductService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});
// Tearms //
router.post('/teams', function (req, res) {
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.teamsService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});
// Privacy //
router.post('/privacy', function (req, res) {
    if(!req.headers.authtoken){
        res.send({
            success: false,
            STATUSCODE: 4200,
            message: "Please provide required information!"
        })
    }
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {
            
            loginRegister.privacyService(req.body, function (result) {
                res.send(result)
            })

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });
});
router.post('/reset-password', function (req, res) {
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {

            if (!req.body.userId) {
                res.send({
                    "response_code": 5002,
                    "response_message": "please provide userId",
                    "response_data": {}
                });
            }
            if (!req.body.forgotPassword) {
                res.send({
                    "response_code": 5002,
                    "response_message": "please provide forgot password",
                    "response_data": {}
                });
            } else {
                if (req.body.forgotPassword === "0") {
                    if (!req.body.currentpassword) {
                        res.send({
                            "response_code": 5002,
                            "response_message": "please provide current password",
                            "response_data": {}
                        });
                    }
                }
            }
            
            if (!req.body.password) {
                res.send({
                    "response_code": 5002,
                    "response_message": "please provide password",
                    "response_data": {}
                });
            } else {
                loginRegister.setPassword(req.body, function (result) {
                    res.send(result)
                })
            }

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});

router.post('/edit-profile', function (req, res) {
    loginRegister.jwtAuthVerification(req.headers, function (auth) {
        if (auth.response_code == 2000) {

            if (!req.body.userId) {
                res.send({
                    "response_code": 5002,
                    "response_message": "please provide userId",
                    "response_data": []
                });
            }
            // else if (!req.body.firstName) {
            //     res.send({
            //         "response_code": 5002,
            //         "response_message": "please provide first name",
            //         "response_data": []
            //     });
            // } 
            else {
                loginRegister.editProfile(req.body, req.protocol, req.get('host'),function (result) {
                    res.send(result)
                })
            }

        } else if (auth.response_code == 4001) {
            res.send(auth);
        } else {
            res.send(auth);
        }
    });

});

router.post('/resend-verification-email', function (req, res) {
    if (!req.body.email) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide your email address",
            "response_data": []
        });
    } else {
        loginRegister.resendVerificationEmail(req.body, req.protocol, req.get('host'), function (result) {
            res.send(result)
        })
    }
});

router.post('/send-forgot-password-email', function (req, res) {
    if (!req.body.email) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide your email address",
            "response_data": []
        });
    } else {
        loginRegister.sendForgotPasswordEmail(req.body, req.protocol, req.get('host'), function (result) {
            res.send(result)
        })
    }
});

router.post('/forgot-password-code-verify', function (req, res) {
    if (!req.body.token) {
        res.send({
            "response_code": 5002,
            "response_message": "please send token",
            "response_data": []
        });
    }
    if (!req.body.code) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide your code",
            "response_data": []
        });
    } else {
        loginRegister.forgotPasswordCodeVerify(req.body, function (result) {
            res.send(result)
        })
    }
});

router.post('/suggestion', function (req, res) {

    if (!req.body.text) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide text",
            "response_data": []
        });
    } else if (!req.body.email) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide email address",
            "response_data": []
        });
    } else {
        loginRegister.suggestion(req.body, function (result) {
            res.send(result)
        })
    }

});
router.get('/terms-service', function (req, res) {
    loginRegister.termsServices(req.body, function (result) {
        res.send(result)
    })
});

router.get('/event-log', function (req, res) {
    loginRegister.eventLog(req.body, function (result) {
        res.send(result)
    })
});

router.post('/get-set-user-settings', function (req, res) {
    console.log(req.body);
    
    
    if (!req.body.type) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide type",
            "response_data": []
        });
    } else {
        
            if (!req.body.mainData) {
                res.send({
                    "response_code": 5002,
                    "response_message": "please provide mainData",
                    "response_data": []
                });
            }
            else{
                if (!req.body.mainData.userId) {
                    res.send({
                        "response_code": 5002,
                        "response_message": "please provide user id",
                        "response_data": []
                    });
                }
                if(req.body.type == "POST"){
                    
                    if (!req.body.mainData.insertUpdate) {
                        res.send({
                            "response_code": 5002,
                            "response_message": "please provide insertUpdate",
                            "response_data": []
                        });
                    }else{
                        
                        if (req.body.mainData.insertUpdate != 'INSERT') {
                            if (!req.body.mainData.rowId) {
                                res.send({
                                    "response_code": 5002,
                                    "response_message": "please provide row id",
                                    "response_data": []
                                });
                            } 
                        }
                        else{
                            //  
                        }
                        
                    } 
                    
                    if (!req.body.mainData.member) {
                        res.send({
                            "response_code": 5002,
                            "response_message": "please provide member name",
                            "response_data": []
                        });
                    }
                    
                    
                    if (!req.body.mainData.firstTime) {
                        res.send({
                            "response_code": 5002,
                            "response_message": "please provide firstTime",
                            "response_data": []
                        });
                    }else{
                        if (req.body.mainData.firstTime != 1) {
                            //console.log(req.body.mainData.itemIds === "");
                            // if (!req.body.mainData.itemIds) {
                            //     res.send({
                            //         "response_code": 5002,
                            //         "response_message": "please provide item ids",
                            //         "response_data": []
                            //     });
                            // }
                            // if (!req.body.mainData.customNames) {
                            //     res.send({
                            //         "response_code": 5002,
                            //         "response_message": "please provide custom names",
                            //         "response_data": []
                            //     });
                            // }
                        }
                        
                        
                    }
                    
                } 
                
            }
            loginRegister.getSetUserSettings(req.body, function (result) {
                res.send(result)
            })
        
    }
    
    
});

router.post('/delete-user-settings', function (req, res) {
    if (!req.body.rowId) {
        res.send({
            "response_code": 5002,
            "response_message": "please provide row id",
            "response_data": []
        });
    } 

    loginRegister.deleteUserSettings(req.body, function (result) {
        res.send(result)
    })
});

module.exports = router;