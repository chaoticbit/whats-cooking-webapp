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
            method: 'GET',
            url: ApiConfig.API_URL + '/Util/getCuisines',            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }
});
