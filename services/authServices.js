var jwt = require('jsonwebtoken');
module.exports = {
    verify: function (req, res, next) {
         var token =  req.headers['x-access-token'];
         if (token) {
             jwt.verify(token,process.env.secretKey,  function (err, decoded) {
                if (err) {
                    return res.json({
                        response_code: 4000,
                        response_message: "Session timeout! Please login again.",
                        response_data: err
                    });
                } else {
                     req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            return res.status(403).send({
                "response_code": 5002,
                "response_message": "Please provide required information"
            });
        }
    }
}