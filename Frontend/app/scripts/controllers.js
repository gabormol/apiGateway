'use strict';

angular.module('apiKeyGenerator')

//apikeyactions.html
.controller('ApiKeyDisplayController', ['$scope', 'AuthFactory', 'ngDialog', function ($scope, AuthFactory, ngDialog) {
    
    $scope.username = '';
    
    AuthFactory.myData().query(
        function (response){
            if(typeof response[0].username !== 'undefined' && response[0].username.length>0){
                $scope.username = " " + response[0].username;
            } else {
                
            }
        },
        function (response){
            $scope.message = "Get username error: " + response.status + " " + response.statusText;
        }
    );

    $scope.addNewApiKey = function() {
        
            ngDialog.open({ template: 'views/addapikey.html', scope: $scope, className: 'ngdialog-theme-default',    controller:"AddApiKeyController" });

    };
    
}])

//addapikey.html
.controller('AddApiKeyController', ['$scope', 'apikeyFactory', 'ngDialog', '$state', function ($scope, apikeyFactory, ngDialog, $state) {
    var newApiKeyRequest = {
        application : "appName",
        feat1 : false,
        feat2 : false,
        feat3 : false,
        quota : 10
    }

    /*$scope.featureOptions = [{
            value: false,
            label: "DISABLED"
        }, {
            value: true,
            label: "ENABLED"
        }
    ]*/

     $scope.featureOptions = {
        model: newApiKeyRequest,
        availableOptions: [
            {value: 'false', label: 'DISABLED'},
            {value: 'true', label: 'ENABLED'}
        ]
    };

    $scope.selectFeature = function(){
        console.log($scope.featureOptions.model);
    }

    $scope.addNewApiKey = function(){
        console.log($scope.featureOptions.model);

        ngDialog.close();
    }


}])

//home.html
.controller('HomeController', ['$scope', '$state', '$rootScope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, $localStorage, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.setUserProps = function () {
        ngDialog.open({ template: 'views/usersettings.html', scope: $scope, className: 'ngdialog-theme-default', controller:"UserSettingsController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $state.go('app', {}, {reload: true}); // back to home
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData, function(){
            if ($scope.loggedIn){
            $state.go('app.actions');
        }
        });

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('LoginController', ['$scope', '$state', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        $state.go('app.actions');

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', '$state', function ($scope, ngDialog, $localStorage, AuthFactory, $state) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {

        AuthFactory.register($scope.registration, function(){
            if ($scope.loggedIn){
            $state.go('app.actions');
        }
        });
        
        ngDialog.close();

    };
}])
;