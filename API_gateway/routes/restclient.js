var request = require('request');

exports.queryExternalEndpoint = function (opt, res, next) {

    console.log(opt);

    function callback(error, response, body) {
        if (error) next(error);
        
        res.json(JSON.parse(body));
    }

    request.get(opt, callback); // -> for previous function

};

exports.createUserData = function (opt, res, next) {

    console.log(opt);

    function callback(error, response, body) {
        if (error) next(error);
        
        res.writeHead(200, {'Context-Type': 'text-plain'});
        res.end(response.body); // just relay the returned result...
    }

    request.post(opt, callback); // -> for previous function

};

exports.modifyUserData = function (opt, res, next) {

    console.log(opt);

    function callback(error, response, body) {
        if (error) next(error);
        res.json(body);
    }

    request.put(opt, callback); // -> for previous function

};

exports.deleteUserData = function (opt, res, next) {

    console.log(opt);

    function callback(error, response, body) {
        if (error) next(error);
        res.json(JSON.parse(body));
    }

    request.delete(opt, callback); // -> for previous function

};