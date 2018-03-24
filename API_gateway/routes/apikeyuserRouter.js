var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Apikeyuser = require('../models/apikeyuser');
var User = require('../models/user');
var Verify = require('./verify');
var ApiKeyEntry = require('../models/apikeyentry');

var apikeyuserRouter = express.Router();
apikeyuserRouter.use(bodyParser.json());

var Utils = require('./utils');

apikeyuserRouter.route('/apikeys')
.all(Verify.verifyOrdinaryUser) //this will decode the req
.get(function (req, res, next) {

    ApiKeyEntry.find({'ownedBy': req.decoded._id}, function (err, apikeys) {
        if (err) next(err);
        console.log("Found something...!");
        
        res.json(apikeys);

    })
})

apikeyuserRouter.route('/')
.all(Verify.verifyOrdinaryUser) //this will decode the req
.get(function (req, res, next) {

    Apikeyuser.find({'ownedBy': req.decoded._id}, function (err, usage) {
        if (err) next(err);
        console.log("Found something...!");
        
        res.json(usage);

    })
})
.post(function (req, res, next) {
    var userId = req.decoded._id;
    var newApikeyuser = req.body;
    newApikeyuser.ownedBy = userId;

    var tokenDataObject = req.body;
    tokenDataObject.isApiKey = true;
    var jwtToken = Verify.getToken(tokenDataObject, true);
    newApikeyuser.jwtToken = jwtToken;

    var appName = req.body.application;
    var description = req.body.description;
    Apikeyuser.create(newApikeyuser, function(err, usage) {
        if (err) {
            var error = new Error('Application name already exist!');
            error.status = 403;
            console.log("ERROR1");
            return next(error);
        };

        console.log('New API key user stored!');
        console.log(usage);

        var newApiKey = {
            "application" : appName,
            "apiKey" : jwtToken,
            "apiKeyToProvide" : Utils.generateApiKeyString(),
            "ownedBy" : userId,
            "description" : description
        }
        ApiKeyEntry.create(newApiKey, function(err, apiKeyEntry) {

            if (err) {
                console.log("ERROR2");
                //var error = new Error('Application name already exist!');
                //err.status = 404;
                return next(err);
            };

            console.log('API Key added to database...');
        })

        var id = usage._id;
        res.writeHead(200, {'Context-Type': 'text-plain'});
        res.end('Added usage with id: ' + id);
    }
    )
})

apikeyuserRouter.route('/:usageId')
.all(Verify.verifyOrdinaryUser) //this will decode the req
.get(function (req, res, next) {
    Apikeyuser.find({'_id': req.params.usageId}) // return template for the appropriate user
        .exec(function (err, usage) {
          if (err) throw err;
          res.json(usage);
    });
   
})
.put(function (req, res, next) {
    Apikeyuser.update({'ownedBy': req.decoded._id, '_id': req.params.usageId}, {
            $set: req.body
            }, {
                upsert: true
            }, function (err, usage) {
                if (err) next(err);
                res.json(usage);
            });
})
.delete(function(req, res, next) {
    Apikeyuser.remove({ownedBy: req.decoded._id, '_id': req.params.usageId}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
})

module.exports = apikeyuserRouter;
