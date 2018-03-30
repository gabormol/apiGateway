var request = require('request');

exports.queryExternalEndpoint = function (opt, res, next) {

    console.log(opt);

    function callback(error, response, body) {
        if (error) next(error);
        
        res.json(JSON.parse(body));
    }

    request.get(opt, callback); // -> for previous function

};

exports.queryExternalEndpoints = function (opt1, opt2, res, next, data, returnResult) {

    console.log("Querying 2 endpoints: ");
    console.log(opt1);
    console.log(opt2);

    var result = [];

    function callback1(error, response, body) {
        console.log("Querying endpoint 1");
        if (error) next(error);
        result.push(JSON.parse(body));
        nextQuery();
    }

    function callback2(error, response, body) {
        console.log("Querying endpoint 2");
        if (error) next(error);
        result.push(JSON.parse(body));
        res.json(result);
    }

    request.get(opt1, callback1); 

    var nextQuery = function(){
        request.get(opt2, callback2);
    }
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