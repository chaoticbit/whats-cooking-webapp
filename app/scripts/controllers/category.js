'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('CategoryCtrl', function ($rootScope, $scope, RecipeService) {    
    $scope.recipes = [];

    function getRecipes() {    
        $('.loader-bg').show();
        RecipeService.getRecipes().then(function(data) {
            if(data.success) {
                $scope.recipes = data.results;                
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {            
            $('.loader-bg').hide();
        });
    }    

    getRecipes();

});
