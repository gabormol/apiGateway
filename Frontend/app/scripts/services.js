'use strict';

angular.module('apiKeyGenerator')
.constant("baseURLgw", "http://localhost:5000/")
.constant("baseURLs1", "http://localhost:3000/")
.constant("baseURLs2", "http://localhost:3001/")

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURLgw', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURLgw, ngDialog){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData, callback) {
        
        $resource(baseURLgw + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token});
              $rootScope.$broadcast('login:Successful');
              callback();
           },
           function(response){
              isAuthenticated = false;
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURLgw + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData, callback) {
        
        $resource(baseURLgw + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password}, callback);
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.myData = function(){
        return $resource(baseURLgw + "users/mydata", null, {
                
            });
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };
    

    loadUserCredentials();
    
    return authFac;
    
}])

.factory('apikeyUserFactory', ['$resource', 'baseURLgw', function ($resource, baseURLgw) { 
        return $resource(baseURLgw + "apikeyusers/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('server1DataFactory', ['$resource', 'baseURLs1', function ($resource, baseURLs1) { 
    return $resource(baseURLs1 + "data/:id", null, {
        'update': {
            method: 'PUT'
        }
    });
}])

.factory('server2DataFactory', ['$resource', 'baseURLs2', function ($resource, baseURLs2) { 
    return $resource(baseURLs2 + "anotherdata/:id", null, {
        'update': {
            method: 'PUT'
        }
    });
}])

.factory('popupFactory', ['$q', '$interval', '$window', '$localStorage', '$state', '$stateParams',
	function ($q, $interval, $window, $localStorage, $state, $stateParams) {
		
		var popup = {}, popupWindow = null, polling = null

		popup.popupWindow = popupWindow

		popup.open = function(options) {

			var width 	= options.width || 500,
				height 	= options.height || 500

			options.windowOptions = options.windowOptions || 'width=500,height=500' + ',top=' + $window.screenY + (($window.outerHeight - height) / 2.5) + ',left=' + $window.screenX + (($window.outerWidth - width) / 2)

            popupWindow = window.open(options.url, '_blank', options.windowOptions)
            //console.log("Window: " + JSON.stringify(popupWindow));

          	if (popupWindow && popupWindow.focus) {
                popupWindow.focus()
                console.log("LOFASZ1");

            	polling = $interval(function() {
                    console.log("LOFASZ2");
	          		try {
	            		if (popupWindow.document.domain === document.domain && popupWindow.document.URL.indexOf('callback') !== -1) {

                            console.log ("LOFASZ -> Content ACCESSES!!!");
							$localStorage.userToken = popupWindow.document.getElementsByTagName('body')[0].innerHTML
	            			$localStorage.name = jwtHelper.decodeToken($localStorage.userToken).name

	            			/*if ($stateParams.redirect) {
	                			$state.go($stateParams.redirect)
	                		} else{
	                			$state.go('user.docs')
	                		}*/

	            			popupWindow.close()
	                		$interval.cancel(polling)
	              		}
	            	} catch (error) {console.log("LOFASZ Error: " + error);}

	            	if (!popupWindow) {
	            		$interval.cancel(polling)
	              		// deferred.reject({ data: 'Provider Popup Blocked' })
	            	} else if (popupWindow.closed) {
	              		$interval.cancel(polling)
	              		// deferred.reject({ data: 'Authorization Failed' })
	            	}
	        	}, 350)
          	}
       	
        }

		return popup
}]);

