'use strict';

angular.module('apiKeyGenerator', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url:'/',
                views: {
                    'content': {
                        templateUrl : 'views/entrypage.html',
                        controller  : 'EntrypageController'
                    }     
                }

            })
            .state('home', {
                url:'/home',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },    
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    }     
                }

            })
            .state('actions', {
                url: '/actions',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },    
                    'content': {
                        templateUrl : 'views/apikeyactions.html',
                        controller  : 'ApiKeyDisplayController'
                    }
                }
            })
            .state('server1', {
                url: '/server1',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },    
                    'content': {
                        templateUrl : 'views/server1.html',
                        controller  : 'Server1Controller'
                    }
                }
            })
            .state('server2', {
                url: '/server2',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },    
                    'content': {
                        templateUrl : 'views/server2.html',
                        controller  : 'Server2Controller'
                    }
                }
            })
    
        $urlRouterProvider.otherwise('/');
    })
;
