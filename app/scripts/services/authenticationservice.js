'use strict';

/**
 * @ngdoc service
 * @name whatsCookingApp.AuthenticationService
 * @description
 * # AuthenticationService
 * Service in the whatsCookingApp.
 */
angular.module('whatsCookingApp').service('AuthenticationService', function ($http, ApiConfig, $httpParamSerializer) {
	this.processLogin = function(payload) {
		return $http({
			method: 'POST',
			url: ApiConfig.API_URL + '/Authentication/login',
			data: payload,			
		});	  
	};
	this.processSignup = function(payload) {
		return $http({
			method: 'POST',
			url: ApiConfig.API_URL + '/Authentication/signup',
			data: payload,			
		});
	}
});
