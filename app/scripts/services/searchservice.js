'use strict';

/**
 * @ngdoc service
 * @name whatsCookingApp.SearchService
 * @description
 * # SearchService
 * Service in the whatsCookingApp.
 */
angular.module('whatsCookingApp').service('SearchService', function ($rootScope, $http, ApiConfig) {
    var token = $rootScope.userProfile.token;    
    
    this.quickSearch = function(key) {
        return $http({
            method: 'GET',
            url: ApiConfig.API_URL + '/Search/quick/' + key,            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }    
});
