'use strict';

angular.module('apiKeyGenerator')

//apikeyactions.html
.controller('ApiKeyDisplayController', ['$scope', 'AuthFactory', 'apikeyUserFactory', 'ngDialog', function ($scope, AuthFactory, apikeyUserFactory, ngDialog) {
    
    $scope.username = '';
    $scope.application = '';
    $scope.apiKey = '';
    $scope.description = '';

    $scope.apiKeys = [];
    
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

    var apiKeys = apikeyUserFactory.query(
        function (response){
            for (var i = 0; i < response.length; i++) {
                $scope.apiKeys.push(response[i]);
            } 
        },
        function (response){
            $scope.message = "Get username error: " + response.status + " " + response.statusText;
        }
    );
    
}])

//addapikey.html
.controller('AddApiKeyController', ['$scope', 'ngDialog', '$state', 'apikeyUserFactory', function ($scope, ngDialog, $state, apikeyUserFactory) {
    $scope.appName = "your application's name";
    $scope.quota = 10;
    $scope.description = "some description..."

    $scope.feature1Options = {
        selectedOption: {value: 'false', label: 'DISABLED'},
        availableOptions: [
            {value: 'false', label: 'DISABLED'},
            {value: 'true', label: 'ENABLED'}
        ]
    };

    $scope.feature2Options = {
        selectedOption: {value: 'false', label: 'DISABLED'},
        availableOptions: [
            {value: 'false', label: 'DISABLED'},
            {value: 'true', label: 'ENABLED'}
        ]
    };

    $scope.feature3Options = {
        selectedOption: {value: 'false', label: 'DISABLED'},
        availableOptions: [
            {value: 'false', label: 'DISABLED'},
            {value: 'true', label: 'ENABLED'}
        ]
    };

    $scope.addNewApiKey = function(){

        var newApiKeyRequest = {
            application : $scope.appName,
            feat1 : $scope.feature1Options.selectedOption.value,
            feat2 : $scope.feature2Options.selectedOption.value,
            feat3 : $scope.feature3Options.selectedOption.value,
            quota : $scope.quota,
            description : $scope.description
        }

        apikeyUserFactory.save( newApiKeyRequest ).$promise.then(
                            function (response) {
                                //$scope.showLoading = false;
                                ngDialog.close();
                                $state.go($state.current, {}, {reload: true});  
                                        
                            },
                            function (response) {
                                console.log(response);
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                alert(response.data.message);
                                //ngDialog.close();
                                //$scope.showLoading = false;
                            });
    }

    $scope.cancelNgDialogue = function(){
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

.directive('redirectToactions', [ '$state', function($state) {
    $state.go('app.actions');
    return {
    };
}])
;