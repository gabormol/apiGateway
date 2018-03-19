'use strict';

angular.module('apiKeyGenerator', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    }     
                }

            })

            // route for the menu page
            .state('app.actions', {
                url: 'actions',
                views: {
                    'content@': {
                        templateUrl : 'views/apikeyactions.html',
                        controller  : 'ApiKeyDisplayController'
                    }
                }
            })
    
        $urlRouterProvider.otherwise('/');
    })
;
