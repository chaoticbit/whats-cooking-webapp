'use strict';

/**
 * @ngdoc service
 * @name whatsCookingApp.UserService
 * @description
 * # UserService
 * Service in the whatsCookingApp.
 */
angular.module('whatsCookingApp').service('UserService', function ($rootScope, $http, ApiConfig) {
    var token = $rootScope.userProfile.token;    
    
    this.getUserProfile = function(payload) {
        return $http({
            method: 'POST',
            url: ApiConfig.API_URL + '/Profile/userprofile',            
            data: payload,
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }
});
