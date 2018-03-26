'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('CategoryCtrl', function ($rootScope, $routeParams, $scope, RecipeService) {    
    $scope.cname = $routeParams.cname;
    $scope.cid = $routeParams.cid;
    $scope.recipes = [];
    $scope.tags = [];
    
    function getPerCategoryRecipes() {    
        $('.loader-bg').show();
        RecipeService.getPerCategoryRecipes({cid: $scope.cid}).then(function(data) {
            if(data.success) {
                $scope.recipes = data.results;                
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {            
            $('.loader-bg').hide();
        });
    }    

    function getCategoryRelatedTags() {
        RecipeService.getCategoryRelatedTags({cid: $scope.cid}).then(function(data) {
            if(data.success) {
                $scope.tags = data.results;                
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {            
            
        });
    }

    (function() {
        getPerCategoryRecipes();
        getCategoryRelatedTags();
    })();    
});
