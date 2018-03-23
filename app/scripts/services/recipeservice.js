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
            method: 'GET',
            url: ApiConfig.API_URL + '/Recipe/getrecipes',            
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}
        });
    };

    this.upvote = function(payload) {
        return $http({
            method: 'POST',
            url: ApiConfig.API_URL + '/Recipe/upvote', 
            data: payload,           
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}
        });
    };

    this.getRecipeById = function(rid) {
        return $http({
            method: 'GET',
            url: ApiConfig.API_URL + '/Recipe/get/' + rid,             
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}
        });
    };

    this.rateRecipe = function(payload) {
        return $http({
            method: 'POST',
            url: ApiConfig.API_URL + '/Recipe/rate/',             
            data: payload,
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': token}
        });
    }
});
