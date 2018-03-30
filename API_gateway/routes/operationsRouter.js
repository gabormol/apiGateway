var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Apikeyuser = require('../models/apikeyuser');
var User = require('../models/user');
var Verify = require('./verify');

var operationsRouter = express.Router();
operationsRouter.use(bodyParser.json());

var restClient = require('./restclient');
var stats = require('./stats')

var cacheForQuota = require('memory-cache');

operationsRouter.route('/')
.all(Verify.verifyApiUser) 
.get(function (req, res, next) {
    
    console.log("Operation permitted for API user");
        
    res.writeHead(200, {'Context-Type': 'text-plain'});
    res.end('Operation permitted for API user: ' + req.decoded.application);

    
})

operationsRouter.route('/data/')
.all(Verify.verifyApiUser) // will create useJwtToken in req
.get(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "GET", true);
    
            console.log("GET operation permitted for API user");

            var options = {
                url: 'http://localhost:3000/data',
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            restClient.queryExternalEndpoint(options, res, next)
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "GET", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }    
    Verify.verifyAllowance(req, "feat1", cacheForQuota, req.apiKeyUserData, callback);
})

.post(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "POST", true);
    
            console.log("POST Operation permitted for API user");

            var options = {
                url: 'http://localhost:3000/data',
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                },
                form: req.body
            };

            restClient.createUserData(options, res, next);

        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "POST", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat1", cacheForQuota, req.apiKeyUserData, callback);
})

operationsRouter.route('/data/:dataId')
.all(Verify.verifyApiUser) // will create useJwtToken in req
.get(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "GET", true);

            console.log("GET operation permitted for API user");
            var newUrl = 'http://localhost:3000/data/' + req.params.dataId;

            var options = {
                url: newUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            restClient.queryExternalEndpoint(options, res, next);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "GET", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat1", cacheForQuota, req.apiKeyUserData, callback);
})
.put(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "PUT", true);
            console.log("PUT operation permitted for API user");
            var newUrl = 'http://localhost:3000/data/' + req.params.dataId;

            var options = {
                url: newUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                },
                json: req.body
            };

            restClient.modifyUserData(options, res, next);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "PUT", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat1", cacheForQuota, req.apiKeyUserData, callback);
})
.delete(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "DELETE", true);
            console.log("DELETE operation permitted for API user");
            var newUrl = 'http://localhost:3000/data/' + req.params.dataId;

            var options = {
                url: newUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            restClient.deleteUserData(options, res, next);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat1", "DELETE", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat1", cacheForQuota, req.apiKeyUserData, callback);
})


operationsRouter.route('/anotherdata/')
.all(Verify.verifyApiUser) // will create useJwtToken in req
.get(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "GET", true);
            console.log("GET operation permitted for API user");
        
            var options = {
                url: 'http://localhost:3001/anotherdata',
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            restClient.queryExternalEndpoint(options, res, next);
            
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "GET", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }   
    Verify.verifyAllowance(req, "feat2", cacheForQuota, req.apiKeyUserData, callback);
})
.post(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "POST", true);
            console.log("POST Operation permitted for API user");

            var options = {
                url: 'http://localhost:3001/anotherdata',
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                },
                form: req.body
            };

            restClient.createUserData(options, res, next);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "POST", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat2", cacheForQuota, req.apiKeyUserData, callback);
})

operationsRouter.route('/anotherdata/:dataId')
.all(Verify.verifyApiUser) // will create useJwtToken in req
.get(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "GET", true);
            console.log("GET operation permitted for API user");

            var newUrl = 'http://localhost:3001/anotherdata/' + req.params.dataId;

            var options = {
                url: newUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            restClient.queryExternalEndpoint(options, res, next);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "GET", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat2", cacheForQuota, req.apiKeyUserData, callback);
})
.put(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "PUT", true);
            console.log("PUT operation permitted for API user");
            var newUrl = 'http://localhost:3001/anotherdata/' + req.params.dataId;

            var options = {
                url: newUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                },
                json: req.body
            };

            restClient.modifyUserData(options, res, next);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "PUT", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat2", cacheForQuota, req.apiKeyUserData, callback);
})
.delete(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "DELETE", true);
            console.log("DELETE operation permitted for API user");
            var newUrl = 'http://localhost:3001/anotherdata/' + req.params.dataId;

            var options = {
                url: newUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            restClient.deleteUserData(options, res, next);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat2", "DELETE", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }
    Verify.verifyAllowance(req, "feat2", cacheForQuota, req.apiKeyUserData, callback);
})

operationsRouter.route('/combinedata/')
.all(Verify.verifyApiUser) // will create useJwtToken in req
.get(function (req, res, next) {

    var callback = {
        success : function(){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat3", "GET", true);
    
            console.log("GET operation permitted for API user");

            var options1 = {
                url: 'http://localhost:3000/data',
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            var options2 = {
                url: 'http://localhost:3001/anotherdata',
                headers: {
                    'Content-Type': 'application/json',
                    'api-gw-identifyer-token': req.useJwtToken
                }
            };

            var data = [];

            var returnResult = {
                returnCollectedData : function (data){
                    var cumulativeObject = Object.assign(data[0], data[1]);
                    JSON.parse(cumulativeObject);
                }
            }

            restClient.queryExternalEndpoints(options1, options2, res, next, data, returnResult);
        },
        failure : function(errorText){
            //Update statistics
            stats.updateStats(req.apiKeyUserData.ownedBy, req.apiKeyUserData.application, "feat3", "GET", false);
            var err = new Error(errorText);
                err.status = 404;
                return next(err);
        }
    }    
    Verify.verifyAllowance(req, "feat3", cacheForQuota, req.apiKeyUserData, callback);
})

module.exports = operationsRouter;
