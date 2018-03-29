var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');
var Apikeyuser = require('../models/apikeyuser');

var Utils = require('./utils.js');

exports.getToken = function (user, isAPIkey) {
    if(isAPIkey){
        console.log('API key creation requested');
        return jwt.sign(user, config.secretKey, {
            expiresIn: 2*43200000
        });
    } else {
        return jwt.sign(user, config.secretKey, {
            expiresIn: 43200000
        });
    }
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
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

exports.verifyApiUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['api-key-token'];
    // decode token
    if (token) {
        Apikeyuser.findOne({'apiKeyToProvide' : { $eq: token}}, function (err, resultApiKeyEntry) {
            if (err) next(err);
            // Let's store the real JWT token to the API key provided
            var correspondingJwtToken = resultApiKeyEntry.jwtToken;
            req.useJwtToken = correspondingJwtToken;
            console.log(resultApiKeyEntry);
            console.log(correspondingJwtToken);

            req.apiKeyUserData = resultApiKeyEntry;
            next();     
        })
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

exports.verifyQuota = function (cacheForQuota, apikeyUserInfo) {
    console.log("Quota verification...");
    var actualQuotaValue = cacheForQuota.get(apikeyUserInfo.application);
    console.log(actualQuotaValue);
    var date = new Date();
    var actualMinute = date.getMinutes();
    var requestsInMinute; 

    var userQuota = cacheForQuota.get(apikeyUserInfo.application);

    if (userQuota === undefined || userQuota === null) {
        console.log('Creating new quota object');
        var userQuota = {};
        userQuota.actualQuotaValue = 1; // 1 because this was the first request
        userQuota.actualMinute = actualMinute;
        userQuota.quotaLimit = apikeyUserInfo.quota;
        cacheForQuota.put(apikeyUserInfo.application, userQuota);
    } else {
        console.log('Updating the quota value...');
        requestsInMinute = userQuota.actualQuotaValue;
        requestsInMinute++;
        userQuota.actualQuotaValue = requestsInMinute;
        console.log('New value for cache: ' + JSON.stringify(userQuota));
        cacheForQuota.put(apikeyUserInfo.application, userQuota);
    }
    
    console.log("actualQuotaValue: " + JSON.stringify(cacheForQuota.get(apikeyUserInfo.application)));

    //Verifying the quota
    if(actualMinute === userQuota.actualMinute && requestsInMinute > userQuota.quotaLimit){
        return false;
    } else if (actualMinute > userQuota.actualMinute || (actualMinute === 0 && userQuota.actualMinute !== 0)) {
        userQuota.actualQuotaValue = 0;
        userQuota.actualMinute = actualMinute;
    }

    return true;
};

exports.verifyAllowance = function (req, feature) {
    console.log("Feature " + feature + " allowance verification...");
    console.log(req.apiKeyUserData[feature]);
    if (req.apiKeyUserData[feature]){
        console.log("Feature allowed!");
        return true;
    } else {
        console.log("Feature not allowed!!!");
        return false;
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
