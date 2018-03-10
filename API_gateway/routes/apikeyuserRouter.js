var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Apikeyuser = require('../models/apikeyuser');
var User = require('../models/user');
var Verify = require('./verify');
var ApiKeyEntry = require('../models/apikeyentry');

var apikeyuserRouter = express.Router();
apikeyuserRouter.use(bodyParser.json());

apikeyuserRouter.route('/')
.all(Verify.verifyOrdinaryUser) //this will decode the req
.get(function (req, res, next) {
    
    //Let's try to find the timesheet
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
    var appName = req.body.application;
    Apikeyuser.create(newApikeyuser, function(err, usage) {
        if (err) throw err;

        console.log('New usage stored!');
        console.log(usage);

        var apiKey = Verify.getToken({"isApiKey": true, "application": appName, "feat1":req.body.feat1,
         "feat2":req.body.feat2, "feat3":req.body.feat3, "quota":req.body.quota}, true);

        var newApiKey = {
            "application" : appName,
            "apiKey" : apiKey
        }
        ApiKeyEntry.create(newApiKey, function(err, apiKeyEntry) {

            if (err) throw err;

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
