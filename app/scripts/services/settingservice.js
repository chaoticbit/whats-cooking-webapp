'use strict';

/**
 * @ngdoc service
 * @name whatsCookingApp.SettingService
 * @description
 * # SettingService
 * Service in the whatsCookingApp.
 */
angular.module('whatsCookingApp').service('SettingService', function ($rootScope, $http, ApiConfig) {
    var token = $rootScope.userProfile.token;

    this.getUserProfile = function() {
        return $http({
            method: 'GET',
            url: ApiConfig.API_URL + '/Settings/userprofile',            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    };
    this.saveUserProfile = function(payload) {
		return $http({
			method: 'POST',
			url: ApiConfig.API_URL + '/Settings/userprofile',
            data: payload,		
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
		});	  
	};
});
