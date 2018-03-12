var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 4320000
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                console.log(decoded);
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {

        if (req.decoded){
            console.log("ALready authenticated as API user: " + req.decoded.username);
            next();
        } else {
            // if there is no token
            // return an error
            var err = new Error('No token provided!');
            err.status = 403;
            return next(err);
        }
    }
};

exports.verifyApiGw = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var apigwtoken = req.headers['api-gw-identifyer-token'];

    // decode token
    if (apigwtoken) {
        // verifies secret and checks exp
        if(apigwtoken.valueOf() === 'AAABBBCCCDDDEEEFFF12345'){
            console.log('API GW token is valid!');

            req.decoded = { "username" : 'apigwuser',
                            "_id" : '5aa41d8220e0da2fbcb85718',
                            "admin" : true,
                            "iat" : 1520704939,
                            "exp" : 1525024939 }

            //we have to build a req.decoded in order the verifyOrdinatyUser to authenticate
            next();
        } else {
            var err = new Error('Invalid APIGW token!!!');
            err.status = 403;
            return next(err);
        }
            
    } else {
       
        console.log('No APIGW token found');
        next();
    }
};

exports.verifyAdmin = function (req, res, next) {
    // if the token is decoded the userinfo is in req.decoded._doc
        //console.log(req.decoded._doc);
        if (req.decoded.admin){
          // if everything is good, save to request for use in other routes
          next();
        } else {
          var err = new Error('You are not authorized to perform this operation!');
          err.status = 403;
          return next(err);
        }
};
