var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

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
    res.end('Operation permitter for API user: ' + req.decoded.application);

    
})

module.exports = operationsRouter;
