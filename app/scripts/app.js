'use strict';

/**
 * @ngdoc overview
 * @name whatsCookingApp
 * @description
 * # whatsCookingApp
 *
 * Main module of the application.
 */
var app = angular
  .module('whatsCookingApp', [
	'ngAnimate',
	'ngAria',
	'ngCookies',
	'ngMessages',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch'
  ]);
  app.config(function ($routeProvider, $httpProvider) {
	$routeProvider
	  .when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl',
		controllerAs: 'main'
	  })
	  .when('/about', {
		templateUrl: 'views/about.html',
		controller: 'AboutCtrl',
		controllerAs: 'about'
	  })
	  .when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginCtrl',
		controllerAs: 'login'
	  })
	  .otherwise({
		redirectTo: '/'
	  });

	  /**
	   *
	   * Custom http interceptors
	   *
	   */

	 $httpProvider.interceptors.push(function($q, $rootScope) {
		return {

			'request': function(config) {
				return config;
			},

			'requestError': function(rejection) {
				return $q.reject(rejection);
			},

			'response': function(response) {				
				/* if it is not an internal angular request then unwrap the response data  */
				if(_.isObject(response.data)) {
					return response.data;
				}
				else {
					// forward internal angular response
					
					return response;
				}
			},

			'responseError': function(rejection) {
				if(rejection.status == -1){
					console.log('generic internet/server error');
					return $q.reject(rejection);
				}
				else{ // if custom API error
				   return rejection;
				}
			}
		};
	});
});

app.run(function($rootScope, $timeout, $window, $location) {
    $rootScope.isLoggedIn = true;
    $rootScope.userProfile = {};
    $rootScope.$on('$locationChangeStart', function(event, currentRoute, prevRoute) {        
        var currentRoute = $location.path();
        $('.toggle-sidebar').removeClass('active');
        $('.sidebar').animate({left: '-100%'}, function () {
            $('.bubble-mobile').show();
            $('.toggle-sidebar').attr('aria-expanded', 'false');
            $('.sidebarwrapper').hide();
            $('body').removeClass('noscroll');
            document.ontouchmove = function (event) {
                event.preventDefault();
            };
        });
        if (currentRoute.substring(1) === 'login') {
            $('body').addClass('login-bg');
        } else {
            $('body').removeClass('login-bg');
        }

        if($rootScope.isLoggedIn){
              //do something
        }else{
            $location.path('/login');
        }
    });  

    $rootScope.logout = function() {
        $window.location.reload();
        $rootScope.isLoggedIn = false;
    };
});