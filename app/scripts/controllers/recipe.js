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
    alert($scope.rid);
});
