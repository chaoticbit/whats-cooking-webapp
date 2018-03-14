'use strict';

/**
 * @ngdoc service
 * @name whatsCookingApp.RecipeService
 * @description
 * # RecipeService
 * Service in the whatsCookingApp.
 */
angular.module('whatsCookingApp').service('RecipeService', function ($rootScope, $http, ApiConfig) {
    var token = $rootScope.userProfile.token;

    this.postNewRecipe = function(payload) {
        return $http({
            method: 'POST',
            url: ApiConfig.API_URL + '/Recipe/newrecipe',
            data: payload,
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}
        });
    };

    this.getRecipes = function() {
        return $http({
            nethod: 'GET',
            url: ApiConfig.API_URL + '/Recipe/getrecipes',
            data: payload,
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}
        });
    }
});
