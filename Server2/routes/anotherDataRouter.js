var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Data = require('../models/anotherdata');
var User = require('../models/user');
var Verify = require('./verify');

var anotherDataRouter = express.Router();
anotherDataRouter.use(bodyParser.json());

anotherDataRouter.route('/')
.all(Verify.verifyOrdinaryUser) //this will decode the req
.get(function (req, res, next) {
    
    //Let's try to find the timesheet
    Data.find({'ownedBy': req.decoded._id}, function (err, data) {
        if (err) next(err);
        console.log("Found something...!");
        
        res.json(data);

    })
})
.post(function (req, res, next) {
    var userId = req.decoded._id;
    var newData = req.body;
    newData.ownedBy = userId;
    Data.create(newData, function(err, data) {
        if (err) throw err;

        console.log('New data stored!');
        console.log(data);

        var id = data._id;
        res.writeHead(200, {'Context-Type': 'text-plain'});
        res.end('Added data with id: ' + id);
    }
    )
})

anotherDataRouter.route('/:dataId')
.all(Verify.verifyOrdinaryUser) //this will decode the req
.get(function (req, res, next) {
    Data.find({'_id': req.params.dataId}) // return template for the appropriate user
        .exec(function (err, data) {
          if (err) throw err;
          res.json(data);
    });
   
})
.put(function (req, res, next) {
    Data.update({'ownedBy': req.decoded._id, '_id': req.params.dataId}, {
            $set: req.body
            }, {
                upsert: true
            }, function (err, data) {
                if (err) next(err);
                res.json(data);
            });
})
.delete(function(req, res, next) {
    Data.remove({ownedBy: req.decoded._id, '_id': req.params.dataId}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
})

module.exports = anotherDataRouter;