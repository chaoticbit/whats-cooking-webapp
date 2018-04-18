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
    
    this.quickSearch = function(key, filter) {
        return $http({
            method: 'GET',
            url: ApiConfig.API_URL + '/Search/quick/' + key + '/' + filter,            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    };

    this.extendedSearch = function(searchApiUrl) {
        return $http({
            method: 'GET',
            url: ApiConfig.API_URL + '/Search/g/' + searchApiUrl,            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}	
        });
    }
});
