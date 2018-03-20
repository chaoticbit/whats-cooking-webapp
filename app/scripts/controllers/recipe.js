'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:RecipeCtrl
 * @description
 * # RecipeCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('RecipeCtrl', function ($scope, $routeParams, $window, RecipeService, UtilService, localStorageService) {
    $scope.rid = $routeParams.id;
    
   RecipeService.getRecipeById($scope.rid).then(function(data) {
       if(data.success) {
           console.log(data.results);
       } else {
           window.location.href = '/';
       }                    
   }, function(error) {
                         
   }).catch(function(e) {
                         
   }).finally(function() {
   });

});
