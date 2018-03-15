'use strict';

/**
 * @ngdoc service
 * @name whatsCookingApp.UtilService
 * @description
 * # UtilService
 * Service in the whatsCookingApp.
 */
angular.module('whatsCookingApp').service('UtilService', function ($rootScope, $http, ApiConfig) {    
    var token = $rootScope.userProfile.token;    
    
    this.getCuisines = function() {
        return $http({
            method: 'POST',
            url: ApiConfig.API_URL + '/Util/getCuisines',            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }

    this.getTags = function() {
        return $http({
            method: 'POST',
            url: ApiConfig.API_URL + '/Util/getTags',            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }

    this.getUserProfile = function() {
        return $http({
            method: 'GET',
            url: ApiConfig.API_URL + '/Authentication/getData',            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }

    this.removeUploadedImage = function(payload) {
        return $http({
            method:'POST',
            url: ApiConfig.API_URL + '/Util/removeUploadedImage',
            data: payload,
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }
});
