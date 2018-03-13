var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');

var Apikeyuser = require('../models/apikeyuser');
var User = require('../models/user');
var Verify = require('./verify');
var ApiKeyEntry = require('../models/apikeyentry');

var operationsRouter = express.Router();
operationsRouter.use(bodyParser.json());

operationsRouter.route('/')
.all(Verify.verifyApiUser) //this will decode the req
.get(function (req, res, next) {
    
    console.log("Operation permitted for API user");
        
    res.writeHead(200, {'Context-Type': 'text-plain'});
    res.end('Operation permitted for API user: ' + req.decoded.application);

    
})

operationsRouter.route('/getdata/')
.all(Verify.verifyApiUser) //this will decode the req
.get(function (req, res, next) {
    
    console.log("Operation permitted for API user");

    var options = {
        url: 'http://localhost:3000/data',
        headers: {
            'Content-Type': 'application/json',
            'api-gw-identifyer-token': req.headers['api-key-token']
        }
    };

    console.log(options);

    function callback(error, response, body) {
        if (error) next(error);
        console.log("Found something on remote server...");
        
        res.json(JSON.parse(body));
    }

    request(options, callback);
    
})

operationsRouter.route('/getanotherdata/')
.all(Verify.verifyApiUser) //this will decode the req
.get(function (req, res, next) {
    
    console.log("Operation permitted for API user");
        
    var options = {
        url: 'http://localhost:3001/anotherdata',
        headers: {
            'Content-Type': 'application/json',
            'api-gw-identifyer-token': req.headers['api-key-token']
        }
    };

    console.log(options);

    function callback(error, response, body) {
        if (error) next(error);
        console.log("Found something on remote server...");
        
        res.json(JSON.parse(body));
    }

    request(options, callback);

    
})

module.exports = operationsRouter;
