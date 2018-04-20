'use strict';

angular.module('apiKeyGenerator')

//apikeyactions.html
.controller('ApiKeyDisplayController', ['$scope', 'AuthFactory', 'apikeyUserFactory', 'ngDialog', '$state',function ($scope, AuthFactory, apikeyUserFactory, ngDialog, $state) {
    
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
            /*alert(response.data.message);
                if (response.data.message === 'You are not authenticated!'){
                    $state.go('app');
            }*/
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
            alert(response.data.message);
            if (response.data.message === 'You are not authenticated!'){
                $state.go('app');
            }
        }
    );

    $scope.deleteApiKey = function(id) {

        $scope.apiKeyId = id;

        ngDialog.open({ template: 'views/deleteapikey.html', scope: $scope, className: 'ngdialog-theme-default',    controller:"ApiKeyDisplayController" });
    };

    $scope.doDeleteApiKey = function(apiKeyId) {

        $scope.apiKeyId = apiKeyId;

        apikeyUserFactory.delete({id: apiKeyId}).$promise.then(
                            function (response) {
                                ngDialog.close();
                                $state.go($state.current, {}, {reload: true});           
                            },
                            function (response) {
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                alert(response.data.message);
                                if (response.data.message === 'You are not authenticated!'){
                                    $state.go('app');
                                }
                                ngDialog.close();
                            });
    };

    $scope.cancelNgDialogue = function(){
        ngDialog.close();
    }
    
}])

//addapikey.html
.controller('AddApiKeyController', ['$scope', 'ngDialog', '$state', 'apikeyUserFactory', '$location', function ($scope, ngDialog, $state, apikeyUserFactory, $location) {
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
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                alert(response.data.message);
                                if (response.data.message === 'You are not authenticated!'){
                                    $state.go('app');
                                }
                                //ngDialog.close();
                                //$scope.showLoading = false;
                            });
    }

    $scope.cancelNgDialogue = function(){
        ngDialog.close();
    }

}])

//entrypage.html
.controller('EntrypageController', ['$scope', '$state', '$rootScope', 'ngDialog', '$localStorage', 'AuthFactory', '$location', 'popupFactory', '$window',
    function ($scope, $state, $rootScope, ngDialog, $localStorage, AuthFactory, $location, popupFactory, $window) {

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
                $state.go('home');
            }
        });

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

    $scope.$on('google:oauth2:signed-in', function (e,val) {
        console.log('is signed in', val)
    });

    $rootScope.$on('google:oauth2:profile', function (e,profile) {
        console.log('got profile', profile)
    });

    $scope.loginWithGoogle = function(){
        console.log("Login with Google...");
        var url =  'http://mydemodomain.com:5000/auth/google';

        var width 	= width || 500, height 	= height || 500;

		var windowOptions = windowOptions || 'width=500,height=500' + ',top=' + $window.screenY + (($window.outerHeight - height) / 2.5) + ',left=' + $window.screenX + (($window.outerWidth - width) / 2);

        window.addEventListener('message', function(event) { 

            // IMPORTANT: Check the origin of the data! 
            if (~event.origin.indexOf('http://mydemodomain.com:5000')) { 
                // The data has been sent from your site 

                // The data sent with postMessage is stored in event.data 
                //console.log("Event data: " + event.data); 

                var receivedObject = JSON.parse(event.data);
                console.log("Event data token: " + receivedObject.token); 
                console.log("Event data user: " + receivedObject.username); 
            } else { 
                // The data hasn't been sent from your site! 
                // Be careful! Do not use it. 
                console.log("Event data2: " + event.data); 
                return; 
            } 
        }); 

        var popupWindow = window.open(url, '_blank', windowOptions)
    }
    
}])

//home.html
.controller('HomeController', ['$scope', '$state', '$rootScope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, $localStorage, AuthFactory) {
    
}])

//server1.html
.controller('Server1Controller', ['$scope', '$state', '$rootScope', 'ngDialog', '$localStorage', 'server1DataFactory', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, $localStorage, server1DataFactory, AuthFactory) {
    $scope.username = "";

    AuthFactory.myData().query(
        function (response){
            if(typeof response[0].username !== 'undefined' && response[0].username.length>0){
                $scope.username = " " + response[0].username;
            } else {
                alert(response.data.message);
            }
        },
        function (response){
            $scope.message = "Get username error: " + response.status + " " + response.statusText;
            /*if (response.data.message === 'You are not authenticated!'){
                $state.go('app');
            }*/
        }
    );
    $scope.server1Data = [];
    var server1Data = server1DataFactory.query(
        function (response){
            for (var i = 0; i < response.length; i++) {
                $scope.server1Data.push(response[i]);
            } 
        },
        function (response){
            $scope.message = "Get error: " + response.status + " " + response.statusText;
            alert(response.data.message);
            if (response.data.message === 'You are not authenticated!'){
                $state.go('app');
            }
        }
    );

    $scope.addNewDocument = function() {
        
        ngDialog.open({ template: 'views/adddata.html', scope: $scope, className: 'ngdialog-theme-default', controller:"Server1Controller" });

    };

    $scope.numberData;
    $scope.stringData;
    $scope.booleanDataOptions = {
        selectedOption: {value: 'false', label: 'FALSE'},
        availableOptions: [
            {value: 'false', label: 'FALSE'},
            {value: 'true', label: 'TRUE'}
        ]
    };

    $scope.addNewDataDocument = function(){

        var newDataDocument = {
            numberData : $scope.numberData,
            stringData : $scope.stringData,
            booleanData : $scope.booleanDataOptions.selectedOption.value 
            
        }

        server1DataFactory.save( newDataDocument ).$promise.then(
                            function (response) {
                                ngDialog.close();
                                $state.go($state.current, {}, {reload: true});             
                            },
                            function (response) {
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                alert(response.data.message);
                                if (response.data.message === 'You are not authenticated!'){
                                    $state.go('app');
                                }
                            });
    }

    $scope.deleteDocument = function(documentId) {

        $scope.documentId = documentId;

        server1DataFactory.delete({id: documentId}).$promise.then(
                            function (response) {
                                ngDialog.close();
                                $state.go($state.current, {}, {reload: true});           
                            },
                            function (response) {
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                alert(response.data.message);
                                if (response.data.message === 'You are not authenticated!'){
                                    $state.go('app');
                                }
                                ngDialog.close();
                            });
    };

    $scope.cancelNgDialogue = function(){
        ngDialog.close();
    }

    $scope.modifyDocument = function(numberData, stringData, booleanData, _id){
        $scope.numberData = numberData;
        $scope.stringData = stringData;
        $scope.booleanDataOptions.selectedOption.value = booleanData;
        $scope.idToModify = _id;
        
        ngDialog.open({ template: 'views/modifydata.html', scope: $scope, className: 'ngdialog-theme-default', controller:"Server1Controller" });
    
    }

    $scope.modifyDocumentInDb = function(){
        var modifiedDataDocument = {
            numberData : $scope.numberData,
            stringData : $scope.stringData,
            booleanData : $scope.booleanDataOptions.selectedOption.value     
        }

        server1DataFactory.update({id: $scope.idToModify}, modifiedDataDocument ).$promise.then(
            function (response) {
                ngDialog.close();
                $state.go($state.current, {}, {reload: true});           
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                alert(response.data.message);
                if (response.data.message === 'You are not authenticated!'){
                    $state.go('app');
                }
                ngDialog.close();
            });
    }
}])

//header.html
.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, $localStorage, AuthFactory) {
    $scope.loggedIn = AuthFactory.isAuthenticated;

    $scope.logOut = function() {
        AuthFactory.logout();
         $scope.loggedIn = false;
         $scope.username = '';
         $state.go('app'); // back to home
     };
}])

//server2.html
.controller('Server2Controller', ['$scope', '$state', '$rootScope', 'ngDialog', '$localStorage', 'server2DataFactory', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, $localStorage, server2DataFactory, AuthFactory) {
    $scope.username = "";

    AuthFactory.myData().query(
        function (response){
            if(typeof response[0].username !== 'undefined' && response[0].username.length>0){
                $scope.username = " " + response[0].username;
            } else {
            }
        },
        function (response){
            $scope.message = "Get username error: " + response.status + " " + response.statusText;
            /*alert(response.data.message);
            if (response.data.message === 'You are not authenticated!'){
                $state.go('app');
            }*/
        }
    );
    $scope.server2Data = [];
    var server2Data = server2DataFactory.query(
        function (response){
            for (var i = 0; i < response.length; i++) {
                $scope.server2Data.push(response[i]);
            } 
        },
        function (response){
            $scope.message = "Get error: " + response.status + " " + response.statusText;
            alert(response.data.message);
            if (response.data.message === 'You are not authenticated!'){
                $state.go('app');
            }
        }
    );

    $scope.addNewDocument = function() {
        
        ngDialog.open({ template: 'views/addanotherdata.html', scope: $scope, className: 'ngdialog-theme-default', controller:"Server2Controller" });

    };

    $scope.anotherNumberData;
    $scope.anotherStringData;
    $scope.anotherBooleanDataOptions = {
        selectedOption: {value: 'false', label: 'FALSE'},
        availableOptions: [
            {value: 'false', label: 'FALSE'},
            {value: 'true', label: 'TRUE'}
        ]
    };

    $scope.addNewDataDocument = function(){

        var newAnotherDataDocument = {
            anotherNumberData : $scope.anotherNumberData,
            anotherStringData : $scope.anotherStringData,
            anotherBooleanData : $scope.anotherBooleanDataOptions.selectedOption.value 
            
        }

        server2DataFactory.save( newAnotherDataDocument ).$promise.then(
                            function (response) {
                                ngDialog.close();
                                $state.go($state.current, {}, {reload: true});             
                            },
                            function (response) {
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                alert(response.data.message);
                                if (response.data.message === 'You are not authenticated!'){
                                    $state.go('app');
                                }
                            });
    }

    $scope.deleteDocument = function(documentId) {

        $scope.documentId = documentId;

        server2DataFactory.delete({id: documentId}).$promise.then(
                            function (response) {
                                ngDialog.close();
                                $state.go($state.current, {}, {reload: true});           
                            },
                            function (response) {
                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                alert(response.data.message);
                                if (response.data.message === 'You are not authenticated!'){
                                    $state.go('app');
                                }
                                ngDialog.close();
                            });
    };

    $scope.cancelNgDialogue = function(){
        ngDialog.close();
    }

    $scope.modifyAnotherDocument = function(numberData, stringData, booleanData, _id){
        $scope.anotherNumberData = numberData;
        $scope.anotherStringData = stringData;
        $scope.anotherBooleanDataOptions.selectedOption.value = booleanData;
        $scope.idToModify = _id;
        
        ngDialog.open({ template: 'views/modifyanotherdata.html', scope: $scope, className: 'ngdialog-theme-default', controller:"Server2Controller" });
    
    }

    $scope.modifyAnotherDocumentInDb = function(){
        var modifiedDataDocument = {
            anotherNumberData : $scope.anotherNumberData,
            anotherStringData : $scope.anotherStringData,
            anotherBooleanData : $scope.anotherBooleanDataOptions.selectedOption.value     
        }

        server2DataFactory.update({id: $scope.idToModify}, modifiedDataDocument ).$promise.then(
            function (response) {
                ngDialog.close();
                $state.go($state.current, {}, {reload: true});           
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                alert(response.data.message);
                if (response.data.message === 'You are not authenticated!'){
                    $state.go('app');
                }
                ngDialog.close();
            });
    }
}])

.controller('LoginController', ['$scope', '$state', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        $state.go('home');

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])


// register.html
.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', '$state', function ($scope, ngDialog, $localStorage, AuthFactory, $state) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {

        AuthFactory.register($scope.registration, function(){
            if ($scope.loggedIn){
            $state.go('home');
        }
        });
        
        ngDialog.close();

    };
}])

.directive('redirectToHome', [ '$state', function($state) {
    $state.go('home');
    return {
    };
}])
.directive('redirectToLogin', [ '$state', function($state) {
    $state.go('app');
    return {
    };
}])
;