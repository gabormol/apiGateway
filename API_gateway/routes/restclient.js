var request = require('request');

exports.queryExternalEndpoint = function (opt, res, next) {

    var options = {
        url: opt.url,
        headers: opt.headers
    };

    console.log(options);

    function callback(error, response, body) {
        if (error) next(error);
        console.log("Found something on remote server...");
        
        res.json(JSON.parse(body));
    }

    request(options, callback); // -> for previous function

};