
module.exports = {
    json: function (err, result) {
        if (err) {
            return ({ success: false, STATUSCODE: 4200, message: "Failed", response: err });
        }
        else {
            return ({ success: true, STATUSCODE: 2000, message: "Success", response: result });
        }

    }
};