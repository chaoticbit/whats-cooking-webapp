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
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Content-Type': 'application/json'}
		});
    };
	this.checkUsername = function(payload) {
		return $http({
			method: 'POST',
			url: ApiConfig.API_URL + '/Authentication/usernameExists',
			data: payload,			
		});
    };
	this.checkEmail = function(payload) {
		return $http({
			method: 'POST',
			url: ApiConfig.API_URL + '/Authentication/emailExists',
			data: payload,			
		});
    };
});
