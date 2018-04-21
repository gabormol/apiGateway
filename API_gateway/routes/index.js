var express = require('express');
var passport = require('passport');
var router = express.Router();
var Verify = require('./verify');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

router.get('/auth/google/callback', function(req,res,next){
    console.log("CALLBACK from Google received!");
    passport.authenticate('google', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        var userForToken = {
          'isApiKey' : false,
          'username' : user.username,
          '_id': user._id
        };
        var token = Verify.getToken(userForToken);
        
        res.writeHead(200, {'Context-Type': 'javascript'});
        var jsonToSend = "{\\\"username\\\" : \\\"" + user.username + "\\\", \\\"token\\\" : \\\"" + token + "\\\"}";
        var scriptToReturn = '<script> window.opener.postMessage(\"' + jsonToSend + '\", \"http://mydemodomain.com:8887\" );</script>';
        //var scriptToReturn = '<script> window.opener.postMessage(\"{\'token\' : \'' + token 
        //  + '\', \'username\' : \'' + user.username + '\'} \", \"http://mydemodomain.com:8887\" );</script>';
        res.end(scriptToReturn);
        //res.status(200).sendFile('../view/index.html');
        //res.render('token',  token );
        /*res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });*/
    });
  })(req,res,next);
});

module.exports = router;
