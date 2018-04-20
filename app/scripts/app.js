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
    'ngTouch',
    'LocalStorageModule',
    'ngFileUpload'
  ]);
  app.config(function ($routeProvider, $httpProvider, localStorageServiceProvider) {
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
    .when('/recipe/:id', {
        templateUrl: 'views/recipe.html',
        controller: 'RecipeCtrl',
        controllerAs: 'recipe'
    })
    .when('/user/:username', {
    templateUrl: 'views/user.html',
    controller: 'UserCtrl',
    controllerAs: 'user'
    })
    .when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'SettingsCtrl',
    controllerAs: 'settings'
    })
    .when('/category/:cname/:cid', {
    templateUrl: 'views/category.html',
    controller: 'CategoryCtrl',
    controllerAs: 'category'
    })
    .when('/tag/:tag', {
    templateUrl: 'views/tag.html',
    controller: 'TagCtrl',
    controllerAs: 'tag'
    })
    .when('/search/:key', {
    templateUrl: 'views/search.html',
    controller: 'SearchCtrl',
    controllerAs: 'search'
    })
    .when('/search/', {
    templateUrl: 'views/search.html',
    controller: 'SearchCtrl',
    controllerAs: 'search'
    })
	  .otherwise({
		redirectTo: '/'
	  });

      /**
       * Local Storage Init
       */
      localStorageServiceProvider.setPrefix('whats-cooking-app');

	  /**	   
	   * Custom http interceptors	   
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

app.run(function($rootScope, $timeout, $window, $location, localStorageService, ApiConfig) {
    $rootScope.apiurl = ApiConfig.API_URL.split('/api')[0];
    $rootScope.isLoggedIn = (localStorageService.length() == 0) ? false : true;    
    $rootScope.userProfile = localStorageService.get('userProfile');
    $rootScope.$on('$locationChangeStart', function(event, currentRoute, prevRoute) {                        
        $('body').removeClass('noscroll');
        var currentRoute = $location.path();
        $('.toggle-sidebar').removeClass('active');
        $('.sidebar').animate({left: '-100%'}, function () {
            $('.bubble-mobile').show();
            $('.toggle-sidebar').attr('aria-expanded', 'false');
            $('.sidebarwrapper').hide();
            $('body').removeClass('noscroll');            
        });    
        if (currentRoute.substring(1) === 'login') {
            $('body').addClass('login-bg');
        } else {
            $('body').removeClass('login-bg');
        }        
        
        if(currentRoute === '/') {                        
            $rootScope.showRecipeBox = true;
        } else {
            $rootScope.showRecipeBox = false;
        }

        if($rootScope.isLoggedIn){
              //do something
        }else{
            $location.path('/login');
        }
    });  

    function signOut() {
        alert('ds');
    }

    $rootScope.logout = function() {
        localStorageService.remove('userProfile');
        $rootScope.isLoggedIn = false;        
        $window.location.reload();        
    };
});