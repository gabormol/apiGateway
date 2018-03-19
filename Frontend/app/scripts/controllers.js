'use strict';

angular.module('apiKeyGenerator')

.controller('ApiKeyDisplayController', ['$scope', 'AuthFactory', function ($scope, AuthFactory) {
    
    $scope.firstName = '';
    
    AuthFactory.myData().query(
        function (response){
            if(typeof response[0].firstname !== 'undefined' && response[0].firstname.length>0){
                $scope.firstName = " " + response[0].firstname;
            } else {
                
            }
        },
        function (response){
            $scope.message = "Get name error: " + response.status + " " + response.statusText;
        }
    );
    
}])

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