'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:TagCtrl
 * @description
 * # TagCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('TagCtrl', function ($rootScope, $routeParams, $scope, RecipeService) {    
    $scope.tagname = $routeParams.tag;    
    $scope.recipes = [];    
    
    function getPerCategoryRecipes() {    
        $('.loader-bg').show();
        RecipeService.getPerTagRecipes({tag: $scope.tagname}).then(function(data) {
            if(data.success) {
                $scope.recipes = data.results;                
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {            
            $('.loader-bg').hide();
        });
    }      

    (function() {
        getPerCategoryRecipes();        
    })();    
});
